import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../../data');
const DB_PATH = path.join(DATA_DIR, 'todos.db');

let _db: DatabaseSync | null = null;

export function getDb(): DatabaseSync {
  if (!_db) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    _db = new DatabaseSync(DB_PATH);
    _db.exec(`
      CREATE TABLE IF NOT EXISTS todos (
        id      TEXT PRIMARY KEY,
        title   TEXT NOT NULL CHECK(length(trim(title)) > 0 AND length(title) <= 280),
        done    INTEGER NOT NULL DEFAULT 0,
        created TEXT NOT NULL
      )
    `);
  }
  return _db;
}
