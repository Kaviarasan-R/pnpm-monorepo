import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleDestroy,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TenantsRepository } from '../master/tenants/tenants.repository';
import { TENANT_ENTITIES } from '../constants';

@Injectable()
export class TenantConnection implements OnModuleDestroy {
  private readonly logger = new Logger(TenantConnection.name);

  private readonly connections = new Map<string, DataSource>();
  private readonly pending = new Map<string, Promise<DataSource>>();

  constructor(private readonly tenantsRepo: TenantsRepository) {}

  async get(uuid: string): Promise<DataSource> {
    const existing = this.connections.get(uuid);
    if (existing?.isInitialized) {
      return existing;
    }

    const inFlight = this.pending.get(uuid);
    if (inFlight) {
      return inFlight;
    }

    const promise = this.create(uuid).finally(() => this.pending.delete(uuid));
    this.pending.set(uuid, promise);
    return promise;
  }

  has(uuid: string): boolean {
    return this.connections.get(uuid)?.isInitialized ?? false;
  }

  async close(uuid: string): Promise<void> {
    const dataSource = this.connections.get(uuid);
    this.connections.delete(uuid);
    if (dataSource?.isInitialized) {
      await dataSource.destroy();
      this.logger.log(`Closed connection for tenant "${uuid}"`);
    }
  }

  async onModuleDestroy(): Promise<void> {
    const uuids = [...this.connections.keys()];
    await Promise.all(uuids.map((uuid) => this.close(uuid)));
  }

  private async create(uuid: string): Promise<DataSource> {
    const tenant = await this.tenantsRepo.findActiveByUuid(uuid);
    if (!tenant) {
      throw new NotFoundException(`Unknown or inactive tenant: "${uuid}"`);
    }

    const dataSource = new DataSource({
      type: 'postgres',
      host: tenant.host,
      port: tenant.port,
      username: tenant.username,
      password: tenant.password,
      database: tenant.database,
      entities: TENANT_ENTITIES,
      synchronize: true, // disabled in production
    });

    await dataSource.initialize();
    this.connections.set(uuid, dataSource);
    this.logger.log(
      `Opened connection for tenant "${uuid}" (db: ${tenant.database} on ${tenant.host})`,
    );
    return dataSource;
  }
}
