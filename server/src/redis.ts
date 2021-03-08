import Redis from "ioredis";

export const redis = new Redis();

export function jset(
  key: Redis.KeyType,
  value: any,
  expiryMode?: string,
  time?: string | number,
  setMode?: string | number
) {
  return redis.set(key, JSON.stringify(value), expiryMode, time, setMode);
}

export async function jget(key: Redis.KeyType): Promise<any | null> {
  const raw = await redis.get(key);
  if (raw === null) return null;

  return JSON.parse(raw);
}
