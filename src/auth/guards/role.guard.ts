import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UserRole } from '../../users/types/user-roles.enum';
import { AccountEntity } from '../../users/entities/account.entity';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.get<UserRole[]>(
      'roles',
      context.getHandler,
    );
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: AccountEntity = request.user;

    const hasPermission = () =>
      user.roles.some((role) => requiredRoles.includes(role));

    if (user && user.roles && hasPermission()) {
      return true;
    }

    throw new ForbiddenException("You has't permission for this route");
  }
}
