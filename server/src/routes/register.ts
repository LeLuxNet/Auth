import { Request, Response } from "express";
import { Token } from "../entities/token";
import { User } from "../entities/user";
import { error, ErrorField, fieldRequired } from "../error";
import { setToken } from "../lib/cookie";
import { hashPassword } from "../lib/crypto";
import { pwnCount } from "../lib/pwned";

enum RegisterMethods {
  EMAIL = "email",
  PASSWORD = "password",
}

export async function register(req: Request, res: Response) {
  const { method } = req.body;
  var user: User | undefined;

  switch (method) {
    case RegisterMethods.EMAIL: {
      throw "Not implemented";
    }
    case RegisterMethods.PASSWORD: {
      const { username, email, password, password2 } = req.body;
      if (username === undefined) {
        return fieldRequired(res, ErrorField.USERNAME);
      } else if (email === undefined) {
        return fieldRequired(res, ErrorField.EMAIL);
      } else if (password === undefined) {
        return fieldRequired(res, ErrorField.PASSWORD);
      }

      // Skip password match check if only only is submited
      if (password2 !== undefined && password !== password2) {
        return error(
          res,
          "The two passwords do not match",
          ErrorField.PASSWORD2
        );
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

        return error(
          res,
          `Your password has already been found ${countStr} in data leaks. Please choose a different one`,
          ErrorField.PASSWORD
        );
      }

      const passwordHash = await hashPassword(password);

      user = await User.create({
        username,
        email,
        password: passwordHash,
      }).save();
      break;
    }
    default: {
      return error(res, `No such method '${method}'`);
    }
  }

  const { token } = await Token.create({ user }).save();
  setToken(res, token);

  res.send({});
}
