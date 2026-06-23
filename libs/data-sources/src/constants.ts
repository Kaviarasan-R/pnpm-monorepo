import { Post } from './tenant/posts/post.entity';
import { Tenant } from './master/tenants/tenant.entity';
import { User } from './master/users/user.entity';

export const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const TENANT_HEADER = 'x-tenant-id';
export const TENANT_CONNECTION = 'tenant';
export const TENANT_ENTITIES = [Post];

export const MASTER_CONNECTION = 'master';
export const MASTER_ENTITIES = [Tenant, User];
