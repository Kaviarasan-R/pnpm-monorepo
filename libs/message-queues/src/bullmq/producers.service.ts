import { Injectable, Logger } from '@nestjs/common';
import { JobsOptions, Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { BULLMQ_QUEUES, QUEUE_1_JOBS, QUEUE_2_JOBS } from '../constants';

@Injectable()
export class BullMQProducersService {
  private readonly logger = new Logger(BullMQProducersService.name);
  protected defaultJobOptions: JobsOptions = {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 10000,
    },
  };

  constructor(
    @InjectQueue(BULLMQ_QUEUES.QUEUE_1)
    private readonly queue1: Queue,

    @InjectQueue(BULLMQ_QUEUES.QUEUE_2)
    private readonly queue2: Queue,
  ) {}

  async queue1_Job1() {
    try {
      const { id } = await this.queue1.add(
        QUEUE_1_JOBS.JOB_1,
        {
          message: 'Job 1',
        },
        this.defaultJobOptions,
      );
      this.logger.log('Produced id: ', id);
      return id;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async queue1_Job2() {
    try {
      const { id } = await this.queue1.add(
        QUEUE_1_JOBS.JOB_2,
        {
          message: 'Job 2',
        },
        this.defaultJobOptions,
      );
      this.logger.log('Produced id: ', id);
      return id;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async queue2_Job1() {
    try {
      const { id } = await this.queue2.add(
        QUEUE_2_JOBS.JOB_1,
        {
          message: 'Job 1',
        },
        this.defaultJobOptions,
      );
      this.logger.log('Produced id: ', id);
      return id;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async queue2_Job2() {
    try {
      const { id } = await this.queue2.add(
        QUEUE_2_JOBS.JOB_2,
        {
          message: 'Job 2',
        },
        this.defaultJobOptions,
      );
      this.logger.log('Produced id: ', id);
      return id;
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
