import { Module } from '@nestjs/common';
import { AppointmentRepository } from './appointment.repository';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { AppointmentQuery } from './query/appointment.query';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentEntity } from './entities/appointment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AppointmentEntity])],
  providers: [AppointmentRepository, AppointmentService, AppointmentQuery],
  controllers: [AppointmentController],
})
export class AppointmentModule {}
