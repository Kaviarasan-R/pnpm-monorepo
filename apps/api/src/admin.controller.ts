import { Controller, Get } from '@nestjs/common';
import {
  UsersRepository,
  TenantConnection,
  Post,
} from '@boilerplate/data-sources';
import { BullMQProducersService } from '@boilerplate/message-queues';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly tenants: TenantConnection,
    private readonly usersRepo: UsersRepository,
    private readonly bullMQProducer: BullMQProducersService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List tenant posts' })
  @ApiResponse({ status: 200, description: 'Returns all posts for the tenant' })
  async listTenants() {
    const uuid = '8f291e13-6fd6-4171-a36f-487d490d8bf1';
    const dataSource = await this.tenants.get(uuid);
    const postRepository = dataSource.getRepository(Post);
    return postRepository.query('SELECT * FROM posts');
  }

  @Get('users')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Returns all users and enqueues background jobs',
  })
  async getUsers() {
    await this.bullMQProducer.queue1_Job1();
    await this.bullMQProducer.queue1_Job2();
    await this.bullMQProducer.queue2_Job1();
    await this.bullMQProducer.queue2_Job2();
    return this.usersRepo.findAll();
  }
}
