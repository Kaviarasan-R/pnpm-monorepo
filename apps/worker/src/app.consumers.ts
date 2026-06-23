import {
  BULLMQ_QUEUES,
  BullMQWorkerAbstract,
} from '@boilerplate/message-queues';
import { Processor } from '@nestjs/bullmq';

@Processor(BULLMQ_QUEUES.QUEUE_1)
export class Queue1Consumers extends BullMQWorkerAbstract {
  constructor() {
    super();
  }

  async process(job: any) {
    return console.log(`QUEUE1: ${job.name}`, job.data);
  }
}

@Processor(BULLMQ_QUEUES.QUEUE_2)
export class Queue2Consumers extends BullMQWorkerAbstract {
  constructor() {
    super();
  }

  async process(job: any) {
    return console.log(`QUEUE2: ${job.name}`, job.data);
  }
}
