import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Post,
  Put,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { User } from './decorators/user.decorator';
import { UserAgent } from './decorators/user-agent.decorator';
import { Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RoleGuard } from './guards/role.guard';
import { Roles } from './decorators/role.gecorator';
import { UserRole } from '../users/types/user-roles.enum';
import { RecoveryPasswordDto } from './dto/recovery-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { EmailDto } from './dto/email.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@User() userId: string) {
    return userId;
  }

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @User() id: string,
    @UserAgent() agent: string,
    @Res() res: Response,
  ) {
    const { accessToken, refreshToken } = await this.service.login(id, agent);
    res.cookie('accessToken', accessToken, { httpOnly: true });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      path: '/auth',
    });

    return res.send({ message: 'Login successful' });
  }
  @Get('refresh-token')
  async refreshToken(
    @Headers('x-refresh-token') refreshToken: string,
    @Res() res: Response,
    @UserAgent() agent: string,
  ) {
    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    const { accessToken } = await this.service.getAccessToken(
      refreshToken,
      agent,
    );
    res.cookie('accessToken', accessToken, { httpOnly: true });
    return res.send({ message: 'Login successful' });
  }

  @Post('registration')
  async registration(@Body() dto: CreateUserDto) {
    return this.service.registration(dto);
  }

  @UseGuards(RoleGuard)
  @Roles(UserRole.SUPERADMIN)
  @Post('create-admin')
  async createAdmin(@Body() dto: CreateUserDto) {
    return this.service.createAdmin(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  async logout(
    @User() userId: string,
    @Headers('x-refresh-token') refreshToken: string,
    @UserAgent() agent: string,
  ) {
    return this.service.logout(userId, refreshToken, agent);
  }

  @Put('confirmation')
  async userConfirmation(@Body() confirmationCode: string) {
    return this.service.userConfirmation(confirmationCode);
  }

  @Post('reset-password')
  async resetPassword(@Body() email: EmailDto) {
    return this.service.resetPassword(email);
  }

  @Post('recovery-password')
  async recoveryPassword(@Body() dto: RecoveryPasswordDto) {
    return this.service.recoveryPassword(dto);
  }

  @Post('/resend-email')
  async resendMail(@Body() email: EmailDto) {
    return this.service.resendEmail(email);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@User() userId: string, @Body() dto: ChangePasswordDto) {
    return this.service.changePassword(userId, dto);
  }
}
