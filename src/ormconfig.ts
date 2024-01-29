import { DataSourceOptions } from 'typeorm';
import { AdditionalEntity } from './additional/additional.entity';
import { CategoryEntity } from './category/category.entity';
import { DocumentEntity } from './document/document.entity';
import { ServiceEntity } from './service/service.entity';
import { CounterEntity } from './document/counter.entity';

const config: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'law',
  password: 'law',
  database: 'law',
  entities: [
    AdditionalEntity,
    CategoryEntity,
    DocumentEntity,
    ServiceEntity,
    CounterEntity,
  ],
  synchronize: false,
  migrations: [__dirname + '/migrations/**/*{.ts, js}'],
};

export default config;
