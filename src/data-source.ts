import { DataSourceOptions } from 'typeorm';
import { UserEntity } from './users/entities/user.entity';
import { AppointmentEntity } from './appointments/entities/appointment.entity';

const config: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'law',
  password: 'law',
  database: 'law',
  entities: [UserEntity, AppointmentEntity],
  synchronize: false,
  migrations: [__dirname + '/migrations/**/*{.ts, js}'],
};

export default config;
