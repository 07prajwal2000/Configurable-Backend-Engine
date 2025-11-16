import { db } from "../../../db";
import { integrationsEntity, appConfigEntity } from "../../../db/schema";
import { eq, and, sql, inArray } from "drizzle-orm";
import { generateID } from "@fluxify/lib";

export interface IntegrationType {
  id: string;
  name: string;
  group: string;
  variant: string;
  config: Record<string, any>;
}

export async function createIntegration(data: Omit<IntegrationType, "id">) {
  const id = generateID();
  const result = await db
    .insert(integrationsEntity)
    .values({ id, ...data })
    .returning();
  return result[0];
}

export async function getIntegrationsByGroupAndVariant(
  group: string,
  variant: string
) {
  const result = await db
    .select()
    .from(integrationsEntity)
    .where(
      and(
        eq(integrationsEntity.group, group),
        eq(integrationsEntity.variant, variant)
      )
    );
  return result;
}

export async function getIntegrationById(id: string) {
  const result = await db
    .select()
    .from(integrationsEntity)
    .where(eq(integrationsEntity.id, id));
  return result[0] || null;
}

export async function updateIntegration(
  id: string,
  data: Partial<Omit<IntegrationType, "id">>
) {
  const result = await db
    .update(integrationsEntity)
    .set(data)
    .where(eq(integrationsEntity.id, id))
    .returning();
  return result[0] || null;
}

export async function deleteIntegration(id: string) {
  const result = await db
    .delete(integrationsEntity)
    .where(eq(integrationsEntity.id, id))
    .returning();
  return result[0] || null;
}

export async function checkNameUniqueInGroupVariant(
  name: string,
  group: string,
  variant: string,
  excludeId?: string
) {
  const conditions = [
    eq(integrationsEntity.group, group),
    eq(integrationsEntity.variant, variant),
    eq(integrationsEntity.name, name),
  ];

  if (excludeId) {
    conditions.push(sql`${integrationsEntity.id} != ${excludeId}`);
  }

  const result = await db
    .select()
    .from(integrationsEntity)
    .where(and(...conditions));

  return result.length === 0;
}

export async function validateAppConfigIds(ids: number[]) {
  if (ids.length === 0) return true;

  const result = await db
    .select({ id: appConfigEntity.id })
    .from(appConfigEntity)
    .where(sql`${appConfigEntity.id} IN ${ids}`);

  return result.length === ids.length;
}
