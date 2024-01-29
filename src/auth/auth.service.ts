import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { compare, hash } from 'bcrypt';
import { UserEntity } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenEntity } from './entities/token.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as crypto from 'node:crypto';
import { EmailService } from '../email/email.service';
import { UserRole } from '../users/types/user-roles.enum';
import { RecoveryPasswordDto } from './dto/recovery-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AccountEntity } from '../users/entities/account.entity';
import { ConfirmationEntity } from '../users/entities/emai-confirmation.entity';
import { validate0rRejectModel } from '../helpers/validateTranserObjects';
import { CreateAppointmentDto } from '../appointments/dto/create-appointment.dto';
import { EmailDto } from './dto/email.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly repository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserEntity> {
    const user = await this.repository.getOneByEmail(email);
    if (!user || !user.emailConfirmation.isConfirmed) {
      throw new UnauthorizedException();
    }
    const validatePassword = compare(password, user.accountData.password);
    if (!validatePassword) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async login(userId: string, agent: string) {
    const sevenDaysInMilliseconds = 7 * 24 * 60 * 60 * 1000;
    const payload = { id: userId };
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    const refreshTokenEntity = new RefreshTokenEntity();
    refreshTokenEntity.token = refreshToken;
    refreshTokenEntity.userId = userId;
    refreshTokenEntity.isRevoked = false;
    refreshTokenEntity.device = agent;
    refreshTokenEntity.expires = new Date(
      new Date().getTime() + sevenDaysInMilliseconds,
    );

    await this.repository.addToken(refreshTokenEntity);
    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '20m' }),
      refreshToken,
    };
  }

  async getAccessToken(token: string, device: string) {
    const refreshToken = await this.repository.getOneToken(token, device);

    if (!refreshToken || new Date() < refreshToken.expires) {
      throw new UnauthorizedException();
    }

    return {
      accessToken: this.jwtService.sign({ id: refreshToken.userId }),
    };
  }

  async registration(dto: CreateUserDto) {
    await validate0rRejectModel(dto, CreateUserDto);
    const expDate = 25 * 60 * 1000;
    const user = await this.repository.getOneByEmail(dto.email);
    if (user) {
      throw new BadRequestException({ message: 'This email is already taken' });
    }

    const accountEntity = new AccountEntity();
    dto.password = await hash(dto.password, 15);
    Object.assign(accountEntity, dto);
    accountEntity.roles = [UserRole.USER];

    const confirmationEntity = new ConfirmationEntity();
    const confirmationCode = crypto.randomUUID();
    confirmationEntity.confirmationCode = confirmationCode;
    confirmationEntity.expirationDate = new Date(
      new Date().getTime() + expDate,
    );

    const userEntity = new UserEntity();
    userEntity.accountData = accountEntity;
    userEntity.emailConfirmation = confirmationEntity;

    this.emailService.sendConfirmMessage(dto.email, confirmationCode);

    const createdUser = await this.repository.save(userEntity);
    delete createdUser.accountData.password;
    return createdUser;
  }

  async createAdmin(dto: CreateUserDto) {
    await validate0rRejectModel(dto, CreateUserDto);
    const user = await this.repository.getOneByEmail(dto.email);
    if (user) {
      throw new BadRequestException();
    }

    const accountEntity = new AccountEntity();
    dto.password = await hash(dto.password, 15);
    Object.assign(accountEntity, dto);
    accountEntity.roles = [UserRole.ADMIN];

    const confirmationEntity = new ConfirmationEntity();
    confirmationEntity.isConfirmed = true;

    const userEntity = new UserEntity();
    userEntity.accountData = accountEntity;
    userEntity.emailConfirmation = confirmationEntity;

    return this.repository.save(userEntity);
  }

  async logout(userId: string, token: string, device: string) {
    return this.repository.deleteToken(userId, token, device);
  }

  async resendEmail(email: EmailDto) {
    const user = await this.repository.getOneByEmail(email.email);
    if (user.emailConfirmation.isConfirmed) {
      throw new BadRequestException();
    }
    const confirmationCode = crypto.randomUUID();
    this.emailService.sendConfirmMessage(email.email, confirmationCode);
    user.emailConfirmation.confirmationCode = confirmationCode;
    return this.repository.save(user);
  }

  async userConfirmation(code: string) {
    const user = await this.repository.getUserByCode(code);
    if (!user) {
      throw new NotFoundException();
    }
    user.emailConfirmation.confirmationCode = '';
    user.emailConfirmation.isConfirmed = true;

    return this.repository.save(user);
  }

  async resetPassword(email: EmailDto) {
    const user = await this.repository.getOneByEmail(email.email);
    if (!user) {
      throw new NotFoundException();
    }
    const expDate = 25 * 60 * 1000;
    const confirmationCode = crypto.randomUUID();
    user.emailConfirmation.confirmationCode = confirmationCode;
    user.emailConfirmation.expirationDate = new Date(
      new Date().getTime() + expDate,
    );
    this.emailService.sendRecoveryCode(email.email, confirmationCode);
    return this.repository.save(user);
  }

  async recoveryPassword(dto: RecoveryPasswordDto): Promise<UserEntity> {
    await validate0rRejectModel(dto, RecoveryPasswordDto);
    const user = await this.repository.getUserByCode(dto.recoveryCode);
    const hashPassword = await hash(dto.password, 15);
    user.emailConfirmation.isConfirmed = true;
    user.accountData.password = hashPassword;

    return this.repository.save(user);
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.repository.getUserById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    const validPassword = await compare(
      user.accountData.password,
      dto.password,
    );
    if (!validPassword) {
      throw new BadRequestException();
    }
    const hashPassword = await hash(dto.newPassword, 15);
    user.accountData.password = hashPassword;

    return this.repository.save(user);
  }
}
