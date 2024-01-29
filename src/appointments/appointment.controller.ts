import { Body, Controller, Post } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly service: AppointmentService) {}

  @Post()
  async create(@Body() dto: CreateAppointmentDto) {
    return this.service.create(dto);
  }
}
