import { Module } from '@nestjs/common';
import { Queue1Consumers, Queue2Consumers } from './app.consumers';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';
import { BULLMQ_QUEUES, BullMQModule } from '@boilerplate/message-queues';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        path.join(process.cwd(), '.env'), // Production
        path.join(process.cwd(), '..', '..', '.env'), // Development
      ],
      isGlobal: true,
    }),
    BullMQModule.register({
      queues: [BULLMQ_QUEUES.QUEUE_1, BULLMQ_QUEUES.QUEUE_2],
    }),
  ],
  providers: [Queue1Consumers, Queue2Consumers],
})
export class AppModule {}
