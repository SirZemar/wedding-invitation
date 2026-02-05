import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const dbPath = process.env.DB_PATH || path.join(__dirname, 'wedding.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize tables
db.exec(`
  -- Submissions table (one per RSVP submission)
  CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    language TEXT NOT NULL,
    notes TEXT
  );

  -- Guests table (linked to submissions)
  CREATE TABLE IF NOT EXISTS guests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    submission_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    attending BOOLEAN NOT NULL,
    is_plus_one_request BOOLEAN DEFAULT 0,
    plus_one_status TEXT DEFAULT NULL,
    FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE
  );
`);

// Migration: Add plus_one_status column if it doesn't exist
try {
  db.exec(`ALTER TABLE guests ADD COLUMN plus_one_status TEXT DEFAULT NULL`);
} catch (e) {
  // Column already exists, ignore
}

console.log('Database initialized successfully');

export default db;
