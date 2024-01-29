import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppointmentEntity } from '../entities/appointment.entity';
import { AppointmentRepository } from '../appointment.repository';
import { Repository } from 'typeorm';
import { QueryType } from '../type/query.type';
import { UserRole } from '../../users/types/user-roles.enum';

@Injectable()
export class AppointmentQuery {
  constructor(
    @InjectRepository(AppointmentEntity)
    private readonly repository: Repository<AppointmentRepository>,
  ) {}

  async getAppointments(query: QueryType) {
    const { type, limit, page, offset } = query;
    let { startDate, endDate } = query;
    const startToday = new Date();
    startToday.setHours(0, 0, 0, 0);
    const endToday = new Date();
    endToday.setHours(23, 59, 59, 999);

    startDate = startDate || startToday;
    endDate = endDate || endToday;
    const queryBuilder = this.repository.createQueryBuilder('appointments');

    if (type === UserRole.ADMIN) {
      queryBuilder.leftJoinAndSelect('appointment.doctor', 'doctor');
    }
    if (type === UserRole.USER) {
      queryBuilder.leftJoinAndSelect('appointments.patient', 'patient');
    }

    queryBuilder.where('appointments.date BETWEEN :startDate AND :endDate', {
      startDate,
      endDate,
    });
  }
}
