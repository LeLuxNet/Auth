import { v4 } from "uuid";
import { User } from "../entities/user";
import { jget, jset, redis } from "../redis";

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
  // TODO: Not override existing token

  const token = v4();
  await jset(token, { uid: user.id, usage } as LinkData, "ex", 60 * 60); // 1 hour

  return token;
}

export async function applyLink(token: string): Promise<LinkUsage | null> {
  const data = (await jget(token)) as LinkData | null;
  if (data === null) return null;

  User.update({ id: data.uid }, { emailVerified: true });

  return data.usage;
}
