import { z } from "zod";
import { responseSchema } from "./dto";
import { getAllIntegrationsByGroup } from "./repository";

export default async function handleRequest(
  group: string
): Promise<z.infer<typeof responseSchema>> {
  const result = await getAllIntegrationsByGroup(group);
  return result.map((item) => ({
    id: item.id,
    name: item.name!,
    group: item.group!,
    variant: item.variant!,
    config: item.config as any,
  }));
}
