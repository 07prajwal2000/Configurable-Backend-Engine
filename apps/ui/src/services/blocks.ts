import { generateID } from "@cbe/lib";

export async function generateBlockID(): Promise<string> {
  return generateID();
}
