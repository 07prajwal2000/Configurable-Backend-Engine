import { Redis } from "ioredis";

let redisClient: Redis = null!;
let publisherClient: Redis = null!;

export const CHAN_ON_ROUTE_CHANGE = "chan:on-route-change";
export const CHAN_ON_EDGE_CHANGE = "chan:on-edge-change";
export const CHAN_ON_BLOCK_CHANGE = "chan:on-block-change";

export function initializeRedis() {
  const canHotreload = process.env.HOT_RELOAD_ROUTES == "true";
  const useCache = process.env.USE_CACHE == "true";

  redisClient = createRedisClient();
  redisClient.connect(() => {
    console.log("redis connected");
  });
  if (canHotreload) {
    redisClient.subscribe(CHAN_ON_ROUTE_CHANGE);
  }
  if (useCache) {
    redisClient.subscribe(CHAN_ON_EDGE_CHANGE, CHAN_ON_BLOCK_CHANGE);
  }
}

export async function publishMessage(chan: string, data: string | object) {
  if (publisherClient == null) {
    publisherClient = createRedisClient();
  }
  data = typeof data === "object" ? JSON.stringify(data) : data;
  await publisherClient.publish(chan, data);
}

export { redisClient };

function createRedisClient() {
  return new Redis({
    host: process.env.REDIS_HOST!,
    port: Number(process.env.REDIS_PORT!),
    username: process.env.REDIS_USER!,
    password: process.env.REDIS_PASS!,
  });
}
