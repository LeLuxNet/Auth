import { Request, Response } from "express";
import { User } from "../entities/user";
import { error, ErrorField, fieldRequired } from "../error";
import { hashPassword } from "../lib/crypto";
import { createTokens } from "../lib/jwt";
import { pwnCount } from "../lib/pwned";

export async function register(req: Request, res: Response) {
  const { username, email, password, password2 } = req.body;

  if (username === undefined) {
    return fieldRequired(res, ErrorField.USERNAME);
  } else if (email === undefined) {
    return fieldRequired(res, ErrorField.EMAIL);
  } else if (password === undefined) {
    return fieldRequired(res, ErrorField.PASSWORD);
  }

  if (password !== password2) {
    return error(res, "The two passwords do not match", ErrorField.PASSWORD2);
  }

  const existingUser = await User.findOne({ where: { username } });
  if (existingUser) {
    return error(
      res,
      "A user with this username already exists",
      ErrorField.USERNAME
    );
  }

  const existingUser2 = await User.findOne({ where: { email } });
  if (existingUser2) {
    return error(
      res,
      "A user with this email already exists",
      ErrorField.EMAIL
    );
  }

  const count = await pwnCount(password);
  if (count !== 0) {
    const countStr = count === 1 ? "1 time" : `${count} times`;

    error(
      res,
      `Your password has already been found ${countStr} in data leaks. Please choose a different one`,
      ErrorField.PASSWORD
    );
  }

  const passwordHash = await hashPassword(password);

  const user = await User.create({
    username,
    email,
    password: passwordHash,
  }).save();

  const { at, rt } = await createTokens(user);

  res.send({
    data: {
      accessToken: at,
      refreshToken: rt,
    },
  });
}
