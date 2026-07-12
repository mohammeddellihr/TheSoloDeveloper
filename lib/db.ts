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
      repoId TEXT NOT NULL REFERENCES repositories(id) ON DELETE CASCADE,
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
  return _db
}

export interface Comment {
  id: string
  text: string
  createdAt: string
}

export interface Ticket {
  id: string
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

export function getTickets(repoId: string): Ticket[] {
  const db = getDb()
  const rows = db.prepare(`
    SELECT t.*, GROUP_CONCAT(c.id || '::' || c.text || '::' || c.createdAt) as commentData
    FROM tickets t
    LEFT JOIN comments c ON c.ticketId = t.id
    WHERE t.repoId = ?
    GROUP BY t.id
    ORDER BY t.createdAt DESC
  `).all(repoId) as (Omit<Ticket, 'comments'> & { commentData: string | null })[]

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

export function getTicket(repoId: string, ticketId: string): Ticket | null {
  const db = getDb()
  const row = db.prepare('SELECT * FROM tickets WHERE id = ? AND repoId = ?').get(ticketId, repoId) as Omit<Ticket, 'comments'> | undefined
  if (!row) return null
  const comments = db.prepare('SELECT * FROM comments WHERE ticketId = ? ORDER BY createdAt ASC').all(ticketId) as Comment[]
  return { ...row, comments }
}

export function createTicket(repoId: string, title: string, description: string): Ticket {
  const db = getDb()
  const id = nanoid()
  const now = iso()
  db.prepare('INSERT INTO tickets (id, repoId, title, description, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)').run(id, repoId, title, description, 'pending', now, now)
  return { id, title, description, status: 'pending', comments: [], createdAt: now, updatedAt: now }
}

export function updateTicketStatus(
  repoId: string,
  ticketId: string,
  status: 'pending' | 'in_progress' | 'completed'
): Ticket | null {
  const db = getDb()
  const now = iso()
  const result = db.prepare('UPDATE tickets SET status = ?, updatedAt = ? WHERE id = ? AND repoId = ?').run(status, now, ticketId, repoId)
  if (result.changes === 0) return null
  return getTicket(repoId, ticketId)
}

export function addComment(repoId: string, ticketId: string, text: string): Ticket | null {
  const db = getDb()
  const ticket = getTicket(repoId, ticketId)
  if (!ticket) return null
  const id = nanoid()
  const now = iso()
  db.prepare('INSERT INTO comments (id, ticketId, text, createdAt) VALUES (?, ?, ?, ?)').run(id, ticketId, text, now)
  db.prepare('UPDATE tickets SET updatedAt = ? WHERE id = ?').run(now, ticketId)
  return getTicket(repoId, ticketId)
}
