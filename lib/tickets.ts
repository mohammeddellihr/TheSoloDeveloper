import { getDb } from "./db"
import { nanoid } from "nanoid"
import type { Ticket, Comment } from "./db"

function iso(): string {
  return new Date().toISOString()
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

export function createTicket(repositoryId: string, title: string, content: string, status: Ticket["status"] = "pending"): Ticket {
  const db = getDb()
  const id = nanoid()
  const now = iso()
  db.prepare('INSERT INTO tickets (id, repositoryId, title, content, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)').run(id, repositoryId, title, content, status, now, now)
  return { id, repositoryId, title, content, status, comments: [], createdAt: now, updatedAt: now }
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

export function updateTicket(
  ticketId: string,
  title: string,
  content: string,
  status: 'pending' | 'in_progress' | 'completed' | 'archived',
  repositoryId: string
): Ticket | null {
  const db = getDb()
  const now = iso()
  const result = db.prepare('UPDATE tickets SET title = ?, content = ?, status = ?, repositoryId = ?, updatedAt = ? WHERE id = ?')
    .run(title, content, status, repositoryId, now, ticketId)
  if (result.changes === 0) return null
  return getTicketById(ticketId)
}

export function deleteTicket(ticketId: string): boolean {
  const result = getDb().prepare('DELETE FROM tickets WHERE id = ?').run(ticketId)
  return result.changes > 0
}
