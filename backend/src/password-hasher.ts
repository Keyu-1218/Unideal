import bcrypt from "bcrypt";


export async function hashPassword(password: string) {
  // 10–12 is reasonable for API workloads
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}