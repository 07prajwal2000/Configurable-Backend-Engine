import { createInsertSchema } from "drizzle-zod";
import z from "zod";
import { projectsEntity } from "../../../../db/schema";
import { db, DbTransactionType } from "../../../../db";
import { eq } from "drizzle-orm";

const insertProjectSchema = createInsertSchema(projectsEntity);

export async function createProject(
  data: z.infer<typeof insertProjectSchema>,
  tx?: DbTransactionType
) {
  const project = await (tx ?? db)
    .insert(projectsEntity)
    .values(data)
    .returning();
  return project.length > 0 ? project[0].id : "";
}

export async function checkProjectExists(name: string, tx?: DbTransactionType) {
  const project = await (tx ?? db)
    .select({ id: projectsEntity.id })
    .from(projectsEntity)
    .where(eq(projectsEntity.name, name))
    .limit(1);
  return project.length > 0;
}
