import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MasterModule } from '../master/master.module';
import { TenantConnection } from './tenant.connection';
import { PostsRepository } from './posts/posts.repository';
import { TENANT_HEADER } from '../constants';
import { TenantProvider } from './tenant.provider';

@Module({
  imports: [MasterModule],
  providers: [TenantConnection, TenantProvider, PostsRepository],
  exports: [TenantConnection, TenantProvider, PostsRepository],
})
export class TenantModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply((req: any, _res: any, next: (err?: unknown) => void) => {
        const value = req.headers?.[TENANT_HEADER];
        if (typeof value === 'string' && value.trim() !== '') {
          req.tenantId = value.trim();
        }
        next();
      })
      .forRoutes('*');
  }
}
