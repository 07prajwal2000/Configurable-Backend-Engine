import { generateID } from "@cbe/lib";

export async function generateEdgeID(): Promise<string> {
  return generateID();
}
