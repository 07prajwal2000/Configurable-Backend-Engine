import { db } from "../db";
import { CHAN_ON_APPCONFIG_CHANGE, subscribeToChannel } from "../db/redis";
import { appConfigEntity } from "../db/schema";
import { EncryptionService } from "../modules/admin/appconfig/encryption";

export let appConfigCache: Record<string, string> = {};

export async function loadAppConfig() {
  const configData = await loadConfigFromDB();
  subscribeToChannel(CHAN_ON_APPCONFIG_CHANGE, async () => {
    appConfigCache = await loadConfigFromDB();
    console.log("appconfig reloaded");
  });
  appConfigCache = configData;
}

async function loadConfigFromDB() {
  const configData = await db
    .select({
      key: appConfigEntity.keyName,
      value: appConfigEntity.value,
      isEncrypted: appConfigEntity.isEncrypted,
      encodingType: appConfigEntity.encoding_type,
    })
    .from(appConfigEntity);
  const config: Record<string, string> = {};
  for (let cfg of configData) {
    let value = cfg.value;
    if (cfg.isEncrypted) {
      value = EncryptionService.decrypt(value!);
    }
    value = EncryptionService.decodeData(value!, cfg.encodingType!);
    config[cfg.key!] = value;
  }

  return config;
}
