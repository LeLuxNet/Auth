import { Request, Response } from "express";
import { RefreshToken } from "../entities/refreshToken";
import { internal } from "../error";
import { regenerateAToken } from "../lib/jwt";
import { redis } from "../redis";

export async function logout(req: Request, res: Response) {
  const { refreshToken: rt } = req.body;
  if (rt === undefined) {
    return internal(res);
  }

  RefreshToken.delete({ token: rt });

  res.send({
    data: {},
  });
}
