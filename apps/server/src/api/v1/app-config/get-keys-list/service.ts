import { z } from "zod";
import { requestQuerySchema, responseSchema } from "./dto";
import { getKeysList } from "./repository";

export default async function handleRequest(
  search?: string
): Promise<z.infer<typeof responseSchema>> {
  const keys = await getKeysList(search);
  return keys.map((item) => item.keyName!);
}
