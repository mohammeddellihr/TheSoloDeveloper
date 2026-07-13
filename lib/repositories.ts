import { getDb } from "./db"
import { nanoid } from "nanoid"
import { iso } from "./utils"
import type { Repository } from "./db"

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
