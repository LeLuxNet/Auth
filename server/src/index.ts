require("./consts");

import express from "express";
import { createConnection } from "typeorm";
import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USER } from "./consts";
import { RefreshToken } from "./entities/refreshToken";
import { User } from "./entities/user";
import { login } from "./routes/login";
import { logout } from "./routes/logout";
import { refresh } from "./routes/refresh";
import { register } from "./routes/register";

const PORT = process.env.PORT || 80;

const main = async () => {
  await createConnection({
    type: "postgres",

    host: DB_HOST,
    port: DB_PORT,
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,

    synchronize: true,
    logging: true,
    entities: [User, RefreshToken],
  });

  const app = express();

  app.get("/", express.static("../client"));
  app.get("/bundle.js", express.static("../client/dist"));

  app.use(express.json());

  /*
  Input:
    method: string
      => email
          username: string
          email: string
      => password:
          username: string
          email: string
          password: string
          password2?: string
  Output:
    accessToken: string
      => store
    refreshToken: string
      => store
  */
  app.post("/api/register", register);

  /*
  Input:
    method: string
      => email
          email: string
      => password
          email: string
          password: string
      => limited
          code?: string
  Output:
    accessToken: string
      => store
    refreshToken: string
      => store
  */
  app.post("/api/login", login);

  /*
  Input:
    refreshToken: string
  Output:
    accessToken: string | null
      string => store
      null => send user to login
  */
  app.post("/api/refresh", refresh);

  /*
  Input:
    refreshToken: string
  Output:
  */
  app.delete("/api/logout", logout);

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
};

main().catch(console.error);
