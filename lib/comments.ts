import { getDb } from "./db"
import { nanoid } from "nanoid"
import type { Comment, Ticket, Note } from "./db"
import { getTicketById } from "./tickets"
import { getNoteWithComments } from "./notes"

function iso(): string {
  return new Date().toISOString()
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

export function addNoteComment(noteId: string, text: string): Note | null {
  const db = getDb()
  const note = getNoteWithComments(noteId)
  if (!note) return null
  const id = nanoid()
  const now = iso()
  db.prepare('INSERT INTO comments (id, noteId, text, createdAt) VALUES (?, ?, ?, ?)').run(id, noteId, text, now)
  db.prepare('UPDATE notes SET updatedAt = ? WHERE id = ?').run(now, noteId)
  return getNoteWithComments(noteId)
}

export function deleteComment(commentId: string): boolean {
  const db = getDb()
  const row = db.prepare('SELECT ticketId, noteId FROM comments WHERE id = ?').get(commentId) as { ticketId: string | null; noteId: string | null } | undefined
  if (!row) return false
  const result = db.prepare('DELETE FROM comments WHERE id = ?').run(commentId)
  if (result.changes > 0) {
    const now = iso()
    if (row.ticketId) {
      db.prepare('UPDATE tickets SET updatedAt = ? WHERE id = ?').run(now, row.ticketId)
    }
    if (row.noteId) {
      db.prepare('UPDATE notes SET updatedAt = ? WHERE id = ?').run(now, row.noteId)
    }
  }
  return result.changes > 0
}

export function updateComment(commentId: string, text: string): Comment | null {
  const db = getDb()
  const now = iso()
  const row = db.prepare('SELECT ticketId, noteId FROM comments WHERE id = ?').get(commentId) as { ticketId: string | null; noteId: string | null } | undefined
  if (!row) return null
  db.prepare('UPDATE comments SET text = ?, updatedAt = ? WHERE id = ?').run(text, now, commentId)
  if (row.ticketId) {
    db.prepare('UPDATE tickets SET updatedAt = ? WHERE id = ?').run(now, row.ticketId)
  }
  if (row.noteId) {
    db.prepare('UPDATE notes SET updatedAt = ? WHERE id = ?').run(now, row.noteId)
  }
  return db.prepare('SELECT * FROM comments WHERE id = ?').get(commentId) as Comment
}
