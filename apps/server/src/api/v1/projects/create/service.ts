import { z } from "zod";
import { requestBodySchema, responseSchema } from "./dto";
import { db } from "../../../../db";
import { checkProjectExist } from "../../routes/create/repository";
import { ConflictError } from "../../../../errors/conflictError";
import { createProject } from "./repository";
import { ServerError } from "../../../../errors/serverError";
import { generateID } from "@fluxify/lib";

export default async function handleRequest(
  data: z.infer<typeof requestBodySchema>
): Promise<z.infer<typeof responseSchema>> {
  const id = await db.transaction(async (tx) => {
    const exist = await checkProjectExist(data.name, tx);
    if (exist)
      throw new ConflictError(
        `Project already exists with '${data.name}' name`
      );
    return await createProject({ ...data, id: generateID() }, tx);
  });
  if (!id) throw new ServerError("Something went wrong while creating project");
  return { id };
}
