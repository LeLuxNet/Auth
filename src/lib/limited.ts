import cryptoRandomString from "crypto-random-string";
import { User } from "../entities/user";
import { redis } from "../redis";
import { createRToken, createTokens } from "./jwt";

// Uppercase characters without 0 and O
const characters = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789";

export async function getCode() {
  while (true) {
    const code = await cryptoRandomString({ length: 6, characters });

    const ret = await redis.set(code, "", ["ex", "nx"], 60 * 30); // 30 minutes
    if (ret === "OK") {
      return code;
    }
  }
}

export async function checkCode(code: string) {
  const id = await redis.get(code);
  if (id === "") {
    return undefined;
  }

  const user = await User.findOne({ where: { id } });
  return user;
}

export async function acceptCode(user: User, code: string) {
  const ret = await redis.set(code, user.id, "xx");
  return ret === "OK";
}
