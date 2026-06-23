import { DynamicModule, Module } from '@nestjs/common';
import { BullMQProducersService } from './producers.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import expressBasicAuth from 'express-basic-auth';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';

export interface QueueSystemOptions {
  queues: string[];
}

@Module({})
export class BullMQModule {
  static register(options: QueueSystemOptions): DynamicModule {
    return {
      module: BullMQModule,
      imports: [
        ConfigModule,
        BullModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            const isTlsEnabled =
              configService.get('REDIS_TLS_ENABLED') === 'true';

            return {
              connection: {
                host: configService.get('REDIS_HOST'),
                port: configService.get('REDIS_PORT'),
                username: configService.get('REDIS_USERNAME'),
                password: configService.get('REDIS_PASSWORD'),
                ...(isTlsEnabled && {
                  tls: {
                    servername: configService.get('REDIS_HOST'),
                  },
                }),
              },
              prefix: '{bull}',
              defaultJobOptions: {
                removeOnComplete: 1000,
              },
            };
          },
        }),
        ...options.queues.map((queueName) =>
          BullModule.registerQueue({
            name: queueName,
          }),
        ),
        BullBoardModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            route: '/queues',
            adapter: ExpressAdapter,
            boardOptions: {
              uiConfig: {
                boardTitle: 'Queues',
              },
            },
            middleware: expressBasicAuth({
              challenge: true,
              users: {
                [configService.get('BULL_BOARD_USERNAME')]:
                  configService.get('BULL_BOARD_PASSWORD') || '',
              },
            }),
          }),
        }),
        ...options.queues.map((queueName) =>
          BullBoardModule.forFeature({
            name: queueName,
            adapter: BullMQAdapter,
          }),
        ),
      ],
      providers: [BullMQProducersService],
      exports: [BullMQProducersService],
    };
  }
}
