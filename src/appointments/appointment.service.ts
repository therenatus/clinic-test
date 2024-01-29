import { Injectable } from '@nestjs/common';
import { AppointmentRepository } from './appointment.repository';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AppointmentEntity } from './entities/appointment.entity';
import { validate0rRejectModel } from '../helpers/validateTranserObjects';

@Injectable()
export class AppointmentService {
  constructor(private readonly repository: AppointmentRepository) {}

  async create(dto: CreateAppointmentDto): Promise<AppointmentEntity> {
    await validate0rRejectModel(dto, CreateAppointmentDto);
    const appointment = new AppointmentEntity();
    Object.assign(appointment, dto);
    return this.repository.save(appointment);
  }

  async update(dto: Partial<CreateAppointmentDto>): Promise<AppointmentEntity> {
    await validate0rRejectModel(dto, CreateAppointmentDto);
    const appointment = new AppointmentEntity();
    Object.assign(appointment, dto);
    return this.repository.save(appointment);
  }
}
