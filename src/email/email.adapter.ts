import * as nodemailer from 'nodemailer';
import * as process from 'node:process';
import { EmailDto } from '../auth/dto/email.dto';

export class EmailAdapter {
  async sendEmail(email: string, subject: string, message: string) {
    const transporter = nodemailer.createTransport({
      service: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      auth: {
        user: process.env.MAIL_LOGIN,
        pass: process.env.MAIL_PASS,
      },
    });

    return await transporter.sendMail({
      from: 'Rinad <zonex1501@gmail.com>',
      to: email,
      subject: subject,
      html: message,
    });
  }
}
