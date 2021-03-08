import { v4 } from "uuid";
import { User } from "../entities/user";
import { jget, redis } from "../redis";

export enum LinkUsage {
  EMAIL_VERIFICATION,
  LOGIN,
  FORGOTTEN_PASSWORD,
}

interface LinkData {
  uid: string;
  usage: LinkUsage;
}

export async function createLink(user: User, usage: LinkUsage) {
  const data: LinkData = { uid: user.id, usage };
  const val = JSON.stringify(data);

  while (true) {
    const token = v4();
    const ret = await redis.set(token, val, ["ex", "nx"], 60 * 60); // 1 hour
    if (ret === "OK") {
      return token;
    }
  }
}

export async function applyLink(token: string): Promise<LinkUsage | null> {
  const data = (await jget(token)) as LinkData | null;
  if (data === null) return null;

  User.update({ id: data.uid }, { emailVerified: true });

  return data.usage;
}
