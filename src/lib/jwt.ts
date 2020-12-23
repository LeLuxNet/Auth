import jwt from "jsonwebtoken";
import { RefreshToken } from "../entities/refreshToken";
import { User, RTData } from "../entities/user";
import { AT_EXPIRATION_TIME, AT_SECRET, RT_SECRET } from "../consts";

function sign(
  payload: object,
  secret: jwt.Secret,
  options: jwt.SignOptions = {}
) {
  return new Promise<string>((resolve, reject) =>
    jwt.sign(payload, secret, options, (err, data) => {
      if (err !== null) {
        reject(err);
      } else {
        resolve(data!);
      }
    })
  );
}

function verify(token: string, secret: jwt.Secret) {
  return new Promise<object>((resolve, reject) =>
    jwt.verify(token, secret, (err, data) => {
      if (err !== null) {
        reject(err);
      } else {
        resolve(data!);
      }
    })
  );
}

async function verifyRT(token: string) {
  const data = (await verify(token, RT_SECRET)) as RTData;

  const entry = await RefreshToken.findOne({ where: { token } });
  if (entry === undefined) return null;

  return data.sub;
}

async function createRToken(user: User) {
  const token = await sign(user.getRTData(), RT_SECRET);

  await RefreshToken.create({ token }).save();
  return token;
}

async function createAToken(user: User) {
  const token = await sign(user.getATData(), AT_SECRET, {
    expiresIn: AT_EXPIRATION_TIME,
  });
  return token;
}

export async function regenerateAToken(rt: string) {
  const id = await verifyRT(rt);
  if (id === null) return null;

  const user = await User.findOne({ where: { id } });
  if (user === undefined) return null;

  return createAToken(user);
}

export async function createTokens(user: User) {
  const at = createAToken(user);
  const rt = createRToken(user);

  return {
    at: await at,
    rt: await rt,
  };
}
