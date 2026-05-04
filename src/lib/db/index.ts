import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

type DrizzleDB = ReturnType<typeof drizzle<typeof schema>>;

const globalForDb = globalThis as unknown as {
  __sqlite?: Database.Database;
  __db?: DrizzleDB;
};

function getClient(): DrizzleDB {
  if (globalForDb.__db) return globalForDb.__db;

  const dbPath = process.env.DATABASE_URL ?? "./data.db";
  const sqlite = new Database(dbPath);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  sqlite.pragma("busy_timeout = 5000");

  const client = drizzle(sqlite, { schema });
  globalForDb.__sqlite = sqlite;
  globalForDb.__db = client;
  return client;
}

export const db = new Proxy({} as DrizzleDB, {
  get(_target, prop) {
    return Reflect.get(getClient(), prop);
  },
});

export { schema };
