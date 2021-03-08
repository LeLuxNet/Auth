import { Request, Response } from "express";
import { Token } from "../entities/token";
import { internal } from "../error";
import { cookieName, getToken } from "../lib/cookie";

export async function logout(req: Request, res: Response) {
  const token = getToken(req);
  if (token === undefined) {
    return internal(res);
  }

  await Token.delete({ token });
  res.clearCookie(cookieName);

  res.send({});
}
