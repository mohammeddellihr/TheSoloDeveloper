import type Database from "better-sqlite3"

export function initializeSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS repositories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      url TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS tickets (
      id TEXT PRIMARY KEY,
      repositoryId TEXT NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
      title TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'pending',
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY,
      ticketId TEXT NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
      text TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT
    );
    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL DEFAULT '',
      keywords TEXT NOT NULL DEFAULT '[]',
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
  `)

  // ponytail: migration for repoId → repositoryId rename
  const columns = db.prepare("PRAGMA table_info(tickets)").all() as { name: string }[]
  if (columns.some(c => c.name === "repoId") && !columns.some(c => c.name === "repositoryId")) {
    db.exec("ALTER TABLE tickets RENAME COLUMN repoId TO repositoryId")
  }

  // ponytail: migration for comments updatedAt column
  const commentColumns = db.prepare("PRAGMA table_info(comments)").all() as { name: string }[]
  if (!commentColumns.some(c => c.name === "updatedAt")) {
    db.exec("ALTER TABLE comments ADD COLUMN updatedAt TEXT")
  }

  // ponytail: migration for description → content column
  const ticketColumns = db.prepare("PRAGMA table_info(tickets)").all() as { name: string }[]
  if (ticketColumns.some(c => c.name === "description") && !ticketColumns.some(c => c.name === "content")) {
    db.exec("ALTER TABLE tickets RENAME COLUMN description TO content")
  }
}
