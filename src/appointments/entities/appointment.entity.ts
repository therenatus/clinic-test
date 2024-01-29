import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('appointments')
export class AppointmentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @Column()
  date: Date;

  @ManyToOne(() => UserEntity, (user) => user.appointmentAsDoctor)
  doctor: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.appointmentAsDoctor)
  patient: UserEntity;
}
