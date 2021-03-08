import { Request, Response } from "express";
import { PRODUCTION } from "../consts";

export const cookieName = "token";

export function getToken(req: Request) {
  return req.cookies[cookieName];
}

export function setToken(res: Response, token: string) {
  res.cookie(cookieName, token, {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    httpOnly: true,
    secure: PRODUCTION,
    sameSite: "lax",
  });
}
