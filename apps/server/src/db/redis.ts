import { Redis } from "ioredis";

let redisClient: Redis = null!;
let publisherClient: Redis = null!;
let subscriberClient: Redis = null!;

export const CHAN_ON_ROUTE_CHANGE = "chan:on-route-change";
export const CHAN_ON_EDGE_CHANGE = "chan:on-edge-change";
export const CHAN_ON_BLOCK_CHANGE = "chan:on-block-change";
export const CHAN_ON_APPCONFIG_CHANGE = "chan:on-appconfig-change";

export const CHAN_ON_INTEGRATION_CHANGE = "chan:on-integration-change";

export function initializeRedis() {
  const canHotreload = process.env.HOT_RELOAD_ROUTES == "true";
  const useCache = process.env.USE_CACHE == "true";

  redisClient = createRedisClient();
  redisClient.connect(() => {
    console.log("redis connected");
  });
  if (canHotreload || useCache) {
    subscriberClient = createRedisClient();
  }
  if (canHotreload) {
    subscriberClient.subscribe(CHAN_ON_ROUTE_CHANGE, CHAN_ON_APPCONFIG_CHANGE);
  }
  if (useCache) {
    subscriberClient.subscribe(CHAN_ON_EDGE_CHANGE, CHAN_ON_BLOCK_CHANGE);
  }
}

export async function publishMessage(chan: string, data: string | object) {
  if (publisherClient == null) {
    publisherClient = createRedisClient();
  }
  data = typeof data === "object" ? JSON.stringify(data) : data;
  await publisherClient.publish(chan, data);
}

export async function subscribeToChannel(
  chan: string,
  callback: (data: string) => void
) {
  subscriberClient.on("message", (channel, data) => {
    if (chan !== channel) return;
    callback(data);
  });
}

function createRedisClient() {
  return new Redis({
    host: process.env.REDIS_HOST!,
    port: Number(process.env.REDIS_PORT!),
    username: process.env.REDIS_USER!,
    password: process.env.REDIS_PASS!,
  });
}

export async function getCache(key: string): Promise<string> {
  const value = await redisClient.get(key);
  return value || "";
}

export async function setCacheEx(
  key: string,
  value: string,
  ttl: number = 120
) {
  await redisClient.setex(key, ttl, value);
}
export async function hasCacheKey(key: string) {
  return redisClient.exists(key);
}
export async function deleteCacheKey(key: string) {
  return redisClient.del(key);
}
export async function setCache(key: string, value: string) {
  await redisClient.set(key, value);
}
