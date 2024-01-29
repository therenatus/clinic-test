import { Injectable } from '@nestjs/common';
import { EmailAdapter } from './email.adapter';
import { EmailDto } from '../auth/dto/email.dto';

@Injectable()
export class EmailService {
  constructor(private readonly adapter: EmailAdapter) {}

  async sendConfirmMessage(email: string, confirmationCode: string) {
    await this.adapter.sendEmail(
      email,
      'Please, confirm email',
      confirmationCode,
    );
  }

  async sendRecoveryCode(email: string, confirmationCode: string) {
    await this.adapter.sendEmail(email, 'Recovery password', confirmationCode);
  }

  async resendEmail(email: string, confirmationCode: string) {
    await this.adapter.sendEmail(email, 'Mail resend', confirmationCode);
  }
}
