import { createUpdateSchema } from "drizzle-zod";
import { projectsEntity } from "../../../../db/schema";
import z from "zod";
import { db, DbTransactionType } from "../../../../db";
import { eq, ilike, or } from "drizzle-orm";

const updateRouteSchema = createUpdateSchema(projectsEntity);

export async function updateProject(
  data: z.infer<typeof updateRouteSchema>,
  tx?: DbTransactionType
) {
  const result = await (tx ?? db)
    .update(projectsEntity)
    .set(data)
    .where(eq(projectsEntity.id, data.id!))
    .returning();
  return result.length > 0 ? result[0] : null;
}

export async function getProjectByIdName(
  id: string,
  name: string,
  tx?: DbTransactionType
) {
  const result = await (tx ?? db)
    .select({ id: projectsEntity.id })
    .from(projectsEntity)
    .where(or(ilike(projectsEntity.name, name), eq(projectsEntity.id, id)));
  return result;
}
