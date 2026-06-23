import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from './tenant.entity';
import { MASTER_CONNECTION } from '../../constants';

@Injectable()
export class TenantsRepository {
  constructor(
    @InjectRepository(Tenant, MASTER_CONNECTION)
    readonly repo: Repository<Tenant>,
  ) {}

  findAll(): Promise<Tenant[]> {
    return this.repo.find();
  }

  findOne(id: number): Promise<Tenant | null> {
    return this.repo.findOneBy({ id });
  }

  findActiveByUuid(uuid: string): Promise<Tenant | null> {
    return this.repo.findOneBy({ uuid, isActive: true });
  }
}
