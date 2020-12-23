import "./consts";

import express from "express";
import { createConnection } from "typeorm";
import { register } from "./routes/register";
import { refresh } from "./routes/refresh";
import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USER } from "./consts";

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
    entities: ["dist/entities/*.js"],
  });

  const app = express();
  app.use(express.json());

  /*
  Input:
    username: string
    email: string
    password: string
    password2: string
  Output:
    accessToken: string
      => store
    refreshToken: string
      => store
  */
  app.post("/register", register);

  /* 
  Input:
    refreshToken: string
  Output:
    accessToken: string | null
      string => store
      null => send user to login
  */
  app.post("/refresh", refresh);

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
};

main().catch(console.error);
