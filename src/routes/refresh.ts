import { Request, Response } from "express";
import { internal } from "../error";
import { regenerateAToken } from "../lib/jwt";

export async function refresh(req: Request, res: Response) {
  const { refreshToken: rt } = req.body;
  if (rt === undefined) {
    return internal(res);
  }

  const at = await regenerateAToken(rt);

  res.send({
    data: {
      accessToken: at,
    },
  });
}
