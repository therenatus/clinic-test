import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../types/user-roles.enum';
import { UserEntity } from './user.entity';

@Entity('account')
export class AccountEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  fullName: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  roles: [UserRole];

  @Column({ select: false })
  password: string;

  @OneToOne(() => UserEntity, (user) => user.accountData)
  user: UserEntity;
}
