import { Request, Response } from "express";
import { Token } from "../entities/token";
import { internal } from "../error";
import { getToken } from "../lib/cookie";

export async function data(req: Request, res: Response) {
  const token = getToken(req);
  if (token === undefined) {
    return internal(res);
  }

  const dbToken = await Token.findOne({
    where: { token },
    relations: ["user"],
  });
  if (dbToken === undefined) {
    return internal(res);
  }

  const user = dbToken.user;

  res.send({
    data: {
      id: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles,
    },
  });
}
