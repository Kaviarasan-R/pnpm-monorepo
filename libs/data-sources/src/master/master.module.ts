import { Module } from '@nestjs/common';
import { MASTER_CONNECTION } from '../constants';
import { User } from './users/user.entity';
import { Tenant } from './tenants/tenant.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './users/users.repository';
import { TenantsRepository } from './tenants/tenants.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User, Tenant], MASTER_CONNECTION)],
  providers: [UsersRepository, TenantsRepository],
  exports: [UsersRepository, TenantsRepository],
})
export class MasterModule {}
