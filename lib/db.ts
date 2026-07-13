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
      createdAt TEXT NOT NULL,
      updatedAt TEXT
    );
    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL DEFAULT '',
      keywords TEXT NOT NULL DEFAULT '[]',
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
  `)
  // ponytail: migration for repoId → repositoryId rename
  const columns = _db.prepare("PRAGMA table_info(tickets)").all() as { name: string }[]
  if (columns.some(c => c.name === "repoId") && !columns.some(c => c.name === "repositoryId")) {
    _db.exec("ALTER TABLE tickets RENAME COLUMN repoId TO repositoryId")
  }
  // ponytail: migration for comments updatedAt column
  const commentColumns = _db.prepare("PRAGMA table_info(comments)").all() as { name: string }[]
  if (!commentColumns.some(c => c.name === "updatedAt")) {
    _db.exec("ALTER TABLE comments ADD COLUMN updatedAt TEXT")
  }
  return _db
}

export interface Comment {
  id: string
  text: string
  createdAt: string
  updatedAt: string | null
}

export interface Ticket {
  id: string
  repositoryId: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'archived'
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

export interface Note {
  id: string
  title: string
  content: string
  keywords: string[]
  createdAt: string
  updatedAt: string
}

export interface Stats {
  totalRepositories: number
  totalTickets: number
  totalNotes: number
  pending: number
  inProgress: number
  completed: number
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

export function createRepository(name: string, url?: string): Repository {
  const db = getDb()
  const id = nanoid()
  const now = iso()
  const repoUrl = url?.trim() || ""
  db.prepare('INSERT INTO repositories (id, name, url, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)').run(id, name, repoUrl, now, now)
  return { id, name, url: repoUrl, createdAt: now, updatedAt: now }
}

export function getTickets(repositoryId: string): Ticket[] {
  const db = getDb()
  const rows = db.prepare(`
    SELECT t.*, GROUP_CONCAT(c.id || '::' || c.text || '::' || c.createdAt || '::' || COALESCE(c.updatedAt, '')) as commentData
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
          const [id, text, createdAt, updatedAt] = raw.split('::')
          return { id, text, createdAt, updatedAt: updatedAt || null }
        })
      : [],
  }))
}

export function getTicketById(ticketId: string): Ticket | null {
  const db = getDb()
  const row = db.prepare('SELECT * FROM tickets WHERE id = ?').get(ticketId) as Omit<Ticket, 'comments'> | undefined
  if (!row) return null
  const comments = db.prepare('SELECT * FROM comments WHERE ticketId = ? ORDER BY createdAt ASC').all(ticketId) as Comment[]
  return { ...row, comments }
}

// ponytail: kept old signature for backward compat; callers updated later
export function getTicket(_repositoryId: string, ticketId: string): Ticket | null {
  return getTicketById(ticketId)
}

export function createTicket(repositoryId: string, title: string, description: string, status: Ticket["status"] = "pending"): Ticket {
  const db = getDb()
  const id = nanoid()
  const now = iso()
  db.prepare('INSERT INTO tickets (id, repositoryId, title, description, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)').run(id, repositoryId, title, description, status, now, now)
  return { id, repositoryId, title, description, status, comments: [], createdAt: now, updatedAt: now }
}

export function updateTicketStatus(
  ticketId: string,
  status: 'pending' | 'in_progress' | 'completed' | 'archived'
): Ticket | null {
  const db = getDb()
  const now = iso()
  const result = db.prepare('UPDATE tickets SET status = ?, updatedAt = ? WHERE id = ?').run(status, now, ticketId)
  if (result.changes === 0) return null
  return getTicketById(ticketId)
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

export function updateRepository(id: string, name: string, url?: string): Repository | null {
  const db = getDb()
  const now = iso()
  const repoUrl = url?.trim() || ""
  const result = db.prepare('UPDATE repositories SET name = ?, url = ?, updatedAt = ? WHERE id = ?').run(name, repoUrl, now, id)
  if (result.changes === 0) return null
  return getRepository(id)
}

export function deleteRepository(id: string): boolean {
  const result = getDb().prepare('DELETE FROM repositories WHERE id = ?').run(id)
  return result.changes > 0
}

export function updateTicket(
  ticketId: string,
  title: string,
  description: string,
  status: 'pending' | 'in_progress' | 'completed' | 'archived',
  repositoryId: string
): Ticket | null {
  const db = getDb()
  const now = iso()
  const result = db.prepare('UPDATE tickets SET title = ?, description = ?, status = ?, repositoryId = ?, updatedAt = ? WHERE id = ?')
    .run(title, description, status, repositoryId, now, ticketId)
  if (result.changes === 0) return null
  return getTicketById(ticketId)
}

export function deleteTicket(ticketId: string): boolean {
  const result = getDb().prepare('DELETE FROM tickets WHERE id = ?').run(ticketId)
  return result.changes > 0
}

export function addComment(ticketId: string, text: string): Ticket | null {
  const db = getDb()
  const ticket = getTicketById(ticketId)
  if (!ticket) return null
  const id = nanoid()
  const now = iso()
  db.prepare('INSERT INTO comments (id, ticketId, text, createdAt) VALUES (?, ?, ?, ?)').run(id, ticketId, text, now)
  db.prepare('UPDATE tickets SET updatedAt = ? WHERE id = ?').run(now, ticketId)
  return getTicketById(ticketId)
}

export function getStats(): Stats {
  const db = getDb()
  const totalRepositories = (db.prepare('SELECT COUNT(*) as count FROM repositories').get() as { count: number }).count
  const totalTickets = (db.prepare('SELECT COUNT(*) as count FROM tickets').get() as { count: number }).count
  const totalNotes = (db.prepare('SELECT COUNT(*) as count FROM notes').get() as { count: number }).count
  const pending = (db.prepare("SELECT COUNT(*) as count FROM tickets WHERE status = 'pending'").get() as { count: number }).count
  const inProgress = (db.prepare("SELECT COUNT(*) as count FROM tickets WHERE status = 'in_progress'").get() as { count: number }).count
  const completed = (db.prepare("SELECT COUNT(*) as count FROM tickets WHERE status = 'completed'").get() as { count: number }).count
  return { totalRepositories, totalTickets, totalNotes, pending, inProgress, completed }
}

export function getNotes(): Note[] {
  const rows = getDb().prepare('SELECT * FROM notes ORDER BY createdAt DESC').all() as (Omit<Note, 'keywords'> & { keywords: string })[]
  return rows.map(r => ({ ...r, keywords: JSON.parse(r.keywords) }))
}

export function getNote(id: string): Note | null {
  const row = getDb().prepare('SELECT * FROM notes WHERE id = ?').get(id) as (Omit<Note, 'keywords'> & { keywords: string }) | undefined
  if (!row) return null
  return { ...row, keywords: JSON.parse(row.keywords) }
}

export function createNote(title: string, content: string, keywords: string[]): Note {
  const db = getDb()
  const id = nanoid()
  const now = iso()
  db.prepare('INSERT INTO notes (id, title, content, keywords, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)').run(id, title, content, JSON.stringify(keywords), now, now)
  return getNote(id)!
}

export function updateNote(id: string, title: string, content: string, keywords: string[]): Note | null {
  const db = getDb()
  const now = iso()
  const result = db.prepare('UPDATE notes SET title = ?, content = ?, keywords = ?, updatedAt = ? WHERE id = ?').run(title, content, JSON.stringify(keywords), now, id)
  if (result.changes === 0) return null
  return getNote(id)
}

export function deleteNote(id: string): boolean {
  const result = getDb().prepare('DELETE FROM notes WHERE id = ?').run(id)
  return result.changes > 0
}

export function deleteComment(commentId: string): boolean {
  const db = getDb()
  const row = db.prepare('SELECT ticketId FROM comments WHERE id = ?').get(commentId) as { ticketId: string } | undefined
  if (!row) return false
  const result = db.prepare('DELETE FROM comments WHERE id = ?').run(commentId)
  if (result.changes > 0) {
    const now = iso()
    db.prepare('UPDATE tickets SET updatedAt = ? WHERE id = ?').run(now, row.ticketId)
  }
  return result.changes > 0
}

export function updateComment(commentId: string, text: string): Comment | null {
  const db = getDb()
  const now = iso()
  const row = db.prepare('SELECT ticketId FROM comments WHERE id = ?').get(commentId) as { ticketId: string } | undefined
  if (!row) return null
  db.prepare('UPDATE comments SET text = ?, updatedAt = ? WHERE id = ?').run(text, now, commentId)
  db.prepare('UPDATE tickets SET updatedAt = ? WHERE id = ?').run(now, row.ticketId)
  return db.prepare('SELECT * FROM comments WHERE id = ?').get(commentId) as Comment
}
