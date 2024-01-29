import { Module } from '@nestjs/common';
import { AppointmentModule } from './appointments/appointment.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from './ormconfig';
import { UserModule } from './users/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    TypeOrmModule.forRoot(ormconfig),
    AppointmentModule,
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
