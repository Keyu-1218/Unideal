import postgres from "postgres";

const DATABASE_URL = process.env.DATABASE_URL!;
export const sql = postgres(DATABASE_URL, {
  max: 10, // pool size
  prepare: true,
});