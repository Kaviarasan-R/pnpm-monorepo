import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  MASTER_CONNECTION,
  MASTER_ENTITIES,
  MasterModule,
  TenantModule,
} from '@boilerplate/data-sources';
import * as path from 'path';
import { TenantController } from './tenant.controller';
import { BULLMQ_QUEUES, BullMQModule } from '@boilerplate/message-queues';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        path.join(process.cwd(), '.env'),
        path.join(process.cwd(), '..', '..', '.env'),
      ],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      name: MASTER_CONNECTION,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: MASTER_ENTITIES,
        autoLoadEntities: true,
        synchronize: true, // disabled in production
      }),
    }),
    MasterModule,
    TenantModule,
    BullMQModule.register({
      queues: [BULLMQ_QUEUES.QUEUE_1, BULLMQ_QUEUES.QUEUE_2],
    }),
  ],
  controllers: [AdminController, TenantController],
})
export class AppModule {}
