import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RefreshTokenEntity } from '../../auth/entities/token.entity';
import { UserRole } from '../types/user-roles.enum';
import { AppointmentEntity } from '../../appointments/entities/appointment.entity';
import { ConfirmationEntity } from './emai-confirmation.entity';
import { AccountEntity } from './account.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => AccountEntity, { cascade: true })
  @JoinColumn()
  accountData: AccountEntity;

  @OneToOne(() => ConfirmationEntity, { cascade: true })
  @JoinColumn()
  emailConfirmation: ConfirmationEntity;

  @OneToMany(() => AppointmentEntity, (appointment) => appointment.patient, {
    lazy: true,
  })
  appointmentAsPatient: AppointmentEntity[];

  @OneToMany(() => AppointmentEntity, (appointment) => appointment.doctor, {
    lazy: true,
  })
  appointmentAsDoctor: AppointmentEntity[];

  @OneToMany(() => RefreshTokenEntity, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshTokenEntity[];
}
