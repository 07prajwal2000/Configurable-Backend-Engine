import { db } from "../db";
import { integrationsEntity } from "../db/schema";
import { integrationsGroupSchema } from "../modules/admin/integrations/dto";
import {
  CHAN_ON_APPCONFIG_CHANGE,
  CHAN_ON_INTEGRATION_CHANGE,
  subscribeToChannel,
} from "../db/redis";
import { appConfigCache } from "./appconfigLoader";

export let dbIntegrationsCache: Record<string, any> = {};
export let kvIntegrationsCache: Record<string, any> = {};

export async function loadIntegrations() {
  await loadFromDB();
  subscribeToChannel(CHAN_ON_INTEGRATION_CHANGE, async () => {
    console.log("integrations reloaded");
    await loadFromDB();
  });
  subscribeToChannel(CHAN_ON_APPCONFIG_CHANGE, async () => {
    console.log("integrations reloaded");
    await loadFromDB();
  });
}

async function loadFromDB() {
  const integrations = await db.select().from(integrationsEntity);
  for (let integration of integrations) {
    if (integration.group === integrationsGroupSchema.enum.database) {
      dbIntegrationsCache[integration.id] = mapIntegrationToConnectionData(
        integration.config as any
      );
    } else if (integration.group === integrationsGroupSchema.enum.kv) {
      kvIntegrationsCache[integration.id] = mapIntegrationToConnectionData(
        integration.config as any
      );
    }
  }
}

function mapIntegrationToConnectionData(config: Record<string, string>) {
  const connectionDetails: typeof config = {} as any;
  for (let key in config) {
    const value = config[key];
    connectionDetails[key] = value.startsWith("cfg:")
      ? appConfigCache[value.slice(4)]
      : value;
  }
  return connectionDetails;
}
