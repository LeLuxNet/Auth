import { Request, Response } from "express";
import { User } from "../entities/user";
import { error, ErrorField, fieldRequired } from "../error";
import { verifyPassword } from "../lib/crypto";
import { createTokens } from "../lib/jwt";
import { checkCode, getCode } from "../lib/limited";

enum LoginMethods {
  EMAIL = "email",
  PASSWORD = "password",
  LIMITED = "limited",
}

const limitedUrl = "https://auth.lelux.net/verify";

export async function login(req: Request, res: Response) {
  const { method } = req.body;
  var user: User | undefined;

  switch (method) {
    case LoginMethods.EMAIL: {
      throw "Not implemented";
    }
    case LoginMethods.PASSWORD: {
      const { email, password } = req.body;
      if (email === undefined) {
        return fieldRequired(res, ErrorField.EMAIL);
      } else if (password === undefined) {
        return fieldRequired(res, ErrorField.PASSWORD);
      }

      user = await User.findOne({ where: { email } });
      if (user === undefined) {
        return error(
          res,
          "There is no user with this email address",
          ErrorField.EMAIL
        );
      }

      const success = await verifyPassword(password, user.password);
      if (!success) {
        return error(res, "Password is wrong", ErrorField.PASSWORD);
      }
      break;
    }
    case LoginMethods.LIMITED: {
      const { code } = req.body;
      if (code === undefined) {
        return res.send({ data: { code: await getCode(), url: limitedUrl } });
      }

      user = await checkCode(code);
      if (user === undefined) {
        return res.send({ data: {} });
      }

      break;
    }
    default: {
      return error(res, `No such method '${method}'`);
    }
  }

  const { at, rt } = await createTokens(user);

  res.send({
    data: {
      accessToken: at,
      refreshToken: rt,
    },
  });
}
