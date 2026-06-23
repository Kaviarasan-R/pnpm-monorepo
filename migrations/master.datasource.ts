import 'dotenv/config';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { MASTER_ENTITIES } from '@boilerplate/data-sources';

dotenv.config({
  path: `../.env`,
});

const datasource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: MASTER_ENTITIES,
  migrations: ['./migrations/master/*.ts'],
});

datasource
  .initialize()
  .then((r) => console.log('Master datasource initialized'))
  .catch((e) => console.error(e));

export default datasource;
