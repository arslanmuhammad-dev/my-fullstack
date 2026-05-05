import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

type DrizzleDB = ReturnType<typeof drizzle<typeof schema>>;

const globalForDb = globalThis as unknown as {
  __sqlite?: Database.Database;
  __db?: DrizzleDB;
};

const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS users (
    id text PRIMARY KEY NOT NULL,
    email text NOT NULL,
    name text NOT NULL,
    password_hash text NOT NULL,
    created_at text NOT NULL DEFAULT (CURRENT_TIMESTAMP)
  );
  CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique ON users (email);
  CREATE TABLE IF NOT EXISTS tasks (
    id text PRIMARY KEY NOT NULL,
    user_id text NOT NULL,
    title text NOT NULL,
    description text,
    status text NOT NULL DEFAULT 'todo',
    priority text NOT NULL DEFAULT 'medium',
    due_date text,
    created_at text NOT NULL DEFAULT (CURRENT_TIMESTAMP),
    updated_at text NOT NULL DEFAULT (CURRENT_TIMESTAMP),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`;

function resolveDbPath(): string {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  if (process.env.VERCEL) return "/tmp/data.db";
  return "./data.db";
}

function getClient(): DrizzleDB {
  if (globalForDb.__db) return globalForDb.__db;

  const sqlite = new Database(resolveDbPath());
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  sqlite.pragma("busy_timeout = 5000");
  sqlite.exec(SCHEMA_SQL);

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
