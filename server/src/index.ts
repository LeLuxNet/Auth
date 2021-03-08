require("./consts");

import cookieParser from "cookie-parser";
import express from "express";
import { createConnection } from "typeorm";
import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USER } from "./consts";
import { Token } from "./entities/token";
import { User } from "./entities/user";
import { data } from "./routes/data";
import { login } from "./routes/login";
import { logout } from "./routes/logout";
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
    entities: [User, Token],
  });

  const app = express();

  app.get("/", express.static("../client"));
  app.get("/bundle.js", express.static("../client/dist"));

  app.use(express.json());
  app.use(cookieParser());

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
  */
  app.post("/api/login", login);

  /*
  Input:
    token: string
  */
  app.delete("/api/logout", logout);

  app.get("/api/data", data);

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
};

main().catch(console.error);
