import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('emailConfirmation')
export class Confirmation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: false })
  isConfirmed: boolean;

  @Column({ nullable: true })
  expirationDate: Date;

  @Column({ nullable: true })
  confirmationCode: string;

  @OneToOne(() => UserEntity, (user) => user.emailConfirmation)
  user: UserEntity;
}
