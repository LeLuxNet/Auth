function env(name: string) {
  const val = process.env[name];
  if (val === undefined) {
    console.error(`The environment variable '${name}' is not set`);
    process.exit(1);
  } else {
    return val;
  }
}

export const DB_HOST = process.env.DB_HOST || "localhost";
export const DB_PORT = parseInt(process.env.DB_PORT || "5432");
export const DB_USER = env("DB_USER");
export const DB_PASSWORD = env("DB_PASSWORD");
export const DB_DATABASE = env("DB_DATABASE");

export const EMAIL_HOST = env("EMAIL_HOST");
export const EMAIL_USER = env("EMAIL_USER");
export const EMAIL_PASSWORD = env("EMAIL_PASSWORD");

export const EMAIL_NAME = env("EMAIL_NAME");
export const EMAIL_FROM = `"${EMAIL_NAME}" <${EMAIL_USER}>`;

export const AT_SECRET = env("AT_SECRET");
export const RT_SECRET = env("RT_SECRET");
export const AT_EXPIRATION_TIME = 15; // 15s
