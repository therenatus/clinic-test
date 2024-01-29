import { DataSource } from 'typeorm';
import { UserEntity } from './users/entities/user.entity';
import { AppointmentEntity } from './appointments/entities/appointment.entity';
import { AccountEntity } from './users/entities/account.entity';
import { ConfirmationEntity } from './users/entities/emai-confirmation.entity';
import { RefreshTokenEntity } from './auth/entities/token.entity';
import process from 'process';

const configMigration = new DataSource({
  type: 'postgres',
  host: process.env.DB_URL,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    UserEntity,
    AccountEntity,
    ConfirmationEntity,
    RefreshTokenEntity,
    AppointmentEntity,
  ],
  synchronize: false,
  migrations: [__dirname + '/migrations/**/*{.ts, js}'],
});

export default configMigration;
