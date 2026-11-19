import { compare, hash } from "bcryptjs";

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  if (!password || !passwordHash) {
    return false;
  }

  try {
    return await compare(password, passwordHash);
  } catch {
    return false;
  }
}
