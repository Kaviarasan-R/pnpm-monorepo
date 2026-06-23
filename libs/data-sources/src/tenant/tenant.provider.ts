import { BadRequestException, Provider, Scope } from '@nestjs/common';
import { TENANT_CONNECTION, TENANT_HEADER, UUID_RE } from '../constants';
import { REQUEST } from '@nestjs/core';
import { TenantConnection } from './tenant.connection';
import { DataSource } from 'typeorm';

export const TenantProvider: Provider = {
  provide: TENANT_CONNECTION,
  scope: Scope.REQUEST,
  inject: [REQUEST, TenantConnection],
  useFactory: (
    req: { tenantId?: string },
    tenants: TenantConnection,
  ): Promise<DataSource> => {
    const id = req.tenantId;
    if (!id) {
      throw new BadRequestException(`Missing "${TENANT_HEADER}" header`);
    }
    if (!UUID_RE.test(id)) {
      throw new BadRequestException(`"${TENANT_HEADER}" must be a valid UUID`);
    }
    return tenants.get(id);
  },
};
