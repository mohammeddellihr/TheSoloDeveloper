import { nanoid } from 'nanoid'
import Database from 'better-sqlite3'
import path from 'node:path'

const DB_PATH = path.join(process.cwd(), 'data.db')

let _db: Database.Database | null = null

function getDb(): Database.Database {
  if (_db) return _db
  _db = new Database(DB_PATH)
  _db.pragma('journal_mode = WAL')
  _db.pragma('foreign_keys = ON')
  _db.exec(`
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
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'pending',
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY,
      ticketId TEXT NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
      text TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );
  `)
  // ponytail: migration for repoId → repositoryId rename
  const columns = _db.prepare("PRAGMA table_info(tickets)").all() as { name: string }[]
  if (columns.some(c => c.name === "repoId") && !columns.some(c => c.name === "repositoryId")) {
    _db.exec("ALTER TABLE tickets RENAME COLUMN repoId TO repositoryId")
  }
  return _db
}

export interface Comment {
  id: string
  text: string
  createdAt: string
}

export interface Ticket {
  id: string
  repositoryId: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed'
  comments: Comment[]
  createdAt: string
  updatedAt: string
}

export interface Repository {
  id: string
  name: string
  url: string
  createdAt: string
  updatedAt: string
}

function iso(): string {
  return new Date().toISOString()
}

export function getRepositories(): Repository[] {
  return getDb().prepare('SELECT * FROM repositories ORDER BY createdAt DESC').all() as Repository[]
}

export function getRepository(id: string): Repository | null {
  return (getDb().prepare('SELECT * FROM repositories WHERE id = ?').get(id) as Repository) ?? null
}

export function createRepository(name: string, url: string): Repository {
  const db = getDb()
  const id = nanoid()
  const now = iso()
  db.prepare('INSERT INTO repositories (id, name, url, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)').run(id, name, url, now, now)
  return { id, name, url, createdAt: now, updatedAt: now }
}

export function getTickets(repositoryId: string): Ticket[] {
  const db = getDb()
  const rows = db.prepare(`
    SELECT t.*, GROUP_CONCAT(c.id || '::' || c.text || '::' || c.createdAt) as commentData
    FROM tickets t
    LEFT JOIN comments c ON c.ticketId = t.id
    WHERE t.repositoryId = ?
    GROUP BY t.id
    ORDER BY t.createdAt DESC
  `).all(repositoryId) as (Omit<Ticket, 'comments'> & { commentData: string | null })[]

  return rows.map(row => ({
    ...row,
    comments: row.commentData
      ? row.commentData.split(',').map(raw => {
          const [id, text, createdAt] = raw.split('::')
          return { id, text, createdAt }
        })
      : [],
  }))
}

export function getTicket(repositoryId: string, ticketId: string): Ticket | null {
  const db = getDb()
  const row = db.prepare('SELECT * FROM tickets WHERE id = ? AND repositoryId = ?').get(ticketId, repositoryId) as Omit<Ticket, 'comments'> | undefined
  if (!row) return null
  const comments = db.prepare('SELECT * FROM comments WHERE ticketId = ? ORDER BY createdAt ASC').all(ticketId) as Comment[]
  return { ...row, comments }
}

export function createTicket(repositoryId: string, title: string, description: string): Ticket {
  const db = getDb()
  const id = nanoid()
  const now = iso()
  db.prepare('INSERT INTO tickets (id, repositoryId, title, description, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)').run(id, repositoryId, title, description, 'pending', now, now)
  return { id, repositoryId, title, description, status: 'pending', comments: [], createdAt: now, updatedAt: now }
}

export function updateTicketStatus(
  repositoryId: string,
  ticketId: string,
  status: 'pending' | 'in_progress' | 'completed'
): Ticket | null {
  const db = getDb()
  const now = iso()
  const result = db.prepare('UPDATE tickets SET status = ?, updatedAt = ? WHERE id = ? AND repositoryId = ?').run(status, now, ticketId, repositoryId)
  if (result.changes === 0) return null
  return getTicket(repositoryId, ticketId)
}

export function getAllTickets(filters?: { repositoryId?: string; status?: string }): (Omit<Ticket, "comments"> & { repoName: string })[] {
  const db = getDb()
  const conditions: string[] = []
  const params: string[] = []
  if (filters?.repositoryId) { conditions.push('t.repositoryId = ?'); params.push(filters.repositoryId) }
  if (filters?.status) { conditions.push('t.status = ?'); params.push(filters.status) }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
  return db.prepare(`SELECT t.*, r.name as repoName FROM tickets t JOIN repositories r ON r.id = t.repositoryId ${where} ORDER BY t.createdAt DESC`).all(...params) as (Omit<Ticket, "comments"> & { repoName: string })[]
}

export function updateRepository(id: string, name: string, url: string): Repository | null {
  const db = getDb()
  const now = iso()
  const result = db.prepare('UPDATE repositories SET name = ?, url = ?, updatedAt = ? WHERE id = ?').run(name, url, now, id)
  if (result.changes === 0) return null
  return getRepository(id)
}

export function deleteRepository(id: string): boolean {
  const result = getDb().prepare('DELETE FROM repositories WHERE id = ?').run(id)
  return result.changes > 0
}

export function updateTicket(
  repositoryId: string,
  ticketId: string,
  title: string,
  description: string,
  status: 'pending' | 'in_progress' | 'completed'
): Ticket | null {
  const db = getDb()
  const now = iso()
  const result = db.prepare('UPDATE tickets SET title = ?, description = ?, status = ?, updatedAt = ? WHERE id = ? AND repositoryId = ?')
    .run(title, description, status, now, ticketId, repositoryId)
  if (result.changes === 0) return null
  return getTicket(repositoryId, ticketId)
}

export function deleteTicket(repositoryId: string, ticketId: string): boolean {
  const result = getDb().prepare('DELETE FROM tickets WHERE id = ? AND repositoryId = ?').run(ticketId, repositoryId)
  return result.changes > 0
}

export function addComment(repositoryId: string, ticketId: string, text: string): Ticket | null {
  const db = getDb()
  const ticket = getTicket(repositoryId, ticketId)
  if (!ticket) return null
  const id = nanoid()
  const now = iso()
  db.prepare('INSERT INTO comments (id, ticketId, text, createdAt) VALUES (?, ?, ?, ?)').run(id, ticketId, text, now)
  db.prepare('UPDATE tickets SET updatedAt = ? WHERE id = ?').run(now, ticketId)
  return getTicket(repositoryId, ticketId)
}
