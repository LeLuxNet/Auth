import { compare, hash } from "bcrypt";

const PASSWORD_BCRYPT_ROUNDS = 14;

export function hashPassword(plain: string) {
  return hash(plain, PASSWORD_BCRYPT_ROUNDS);
}

export function verifyPassword(plain: string, hash: string) {
  return compare(plain, hash);
}
