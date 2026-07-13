import { getDb } from "./db"
import { nanoid } from "nanoid"
import type { Note, Comment } from "./db"

function iso(): string {
  return new Date().toISOString()
}

export function getNotes(): Note[] {
  const rows = getDb().prepare('SELECT * FROM notes ORDER BY createdAt DESC').all() as (Omit<Note, 'keywords' | 'comments'> & { keywords: string })[]
  return rows.map(r => ({ ...r, keywords: JSON.parse(r.keywords), comments: [] }))
}

export function getNote(id: string): Note | null {
  const row = getDb().prepare('SELECT * FROM notes WHERE id = ?').get(id) as (Omit<Note, 'keywords' | 'comments'> & { keywords: string }) | undefined
  if (!row) return null
  return { ...row, keywords: JSON.parse(row.keywords), comments: [] }
}

export function getNoteWithComments(id: string): Note | null {
  const db = getDb()
  const row = db.prepare('SELECT * FROM notes WHERE id = ?').get(id) as (Omit<Note, 'keywords' | 'comments'> & { keywords: string }) | undefined
  if (!row) return null
  const comments = db.prepare('SELECT * FROM comments WHERE noteId = ? ORDER BY createdAt ASC').all(id) as Comment[]
  return { ...row, keywords: JSON.parse(row.keywords), comments }
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
