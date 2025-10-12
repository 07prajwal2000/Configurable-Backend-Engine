import { httpClient } from "./httpClient";

export enum IntegrationGroup {
  Database = "database",
  kv = "kv",
}

export enum Variant {
  PostgreSQL = "PostgreSQL",
  MongoDB = "MongoDB",
  Redis = "Redis",
  Memcached = "Memcached",
}

export interface BaseIntegration<T> {
  id: string;
  name: string;
  variant: string;
  config: T;
}

export const integrationsService = {
  async getAll<T>(
    group: IntegrationGroup,
    variant: Variant
  ): Promise<BaseIntegration<T>[]> {
    const url = `/integrations/${group}/${variant}`;
    const result = await httpClient.get(url);
    return result.data;
  },
  async update(
    id: string,
    group: IntegrationGroup,
    variant: Variant,
    data: object
  ) {
    const url = `/integrations/${group}/${variant}/${id}`;
    await httpClient.put(url, data);
  },
  async create(group: IntegrationGroup, variant: Variant, data: object) {
    const url = `/integrations/${group}/${variant}`;
    await httpClient.post(url, data);
  },
  async delete(id: string) {
    const url = `/integrations/${id}`;
    await httpClient.delete(url);
  },
};
