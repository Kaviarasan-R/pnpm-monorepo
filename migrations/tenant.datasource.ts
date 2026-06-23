import 'dotenv/config';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { TENANT_ENTITIES } from '@boilerplate/data-sources';

dotenv.config({
  path: `../.env`,
});

const datasource = new DataSource({
  type: 'postgres',
  host: process.env.TENANT_DB_HOST,
  port: Number(process.env.TENANT_DB_PORT),
  username: process.env.TENANT_DB_USERNAME,
  password: process.env.TENANT_DB_PASSWORD,
  database: process.env.TENANT_DB_NAME,
  entities: TENANT_ENTITIES,
  migrations: ['./migrations/tenant/*.ts'],
});

datasource
  .initialize()
  .then((r) => console.log('Tenant datasource initialized'))
  .catch((e) => console.error(e));

export default datasource;
