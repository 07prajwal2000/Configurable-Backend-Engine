import { db } from "../../../../db";
import { BadRequestError } from "../../../../errors/badRequestError";
import { NotFoundError } from "../../../../errors/notFoundError";
import { checkAppConfigExist, deleteAppConfig } from "./repository";
import { CHAN_ON_APPCONFIG_CHANGE, publishMessage } from "../../../../db/redis";

export default async function handleRequest(id: number) {
  if (!id || isNaN(id)) {
    throw new BadRequestError("Invalid ID");
  }
  await db.transaction(async (tx) => {
    const exist = await checkAppConfigExist(id, tx);
    if (!exist) {
      throw new NotFoundError("App config not found");
    }
    const result = await deleteAppConfig(id, tx);
    if (!result) {
      throw new BadRequestError("Failed to delete app config");
    }
  });
  await publishMessage(CHAN_ON_APPCONFIG_CHANGE, "");
}
