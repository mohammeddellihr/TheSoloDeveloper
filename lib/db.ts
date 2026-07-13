import Database from 'better-sqlite3'
import path from 'node:path'
import { initializeSchema } from './schema'

export { getRepositories, getRepository, createRepository, updateRepository, deleteRepository } from './repositories'
export { getTickets, getTicketById, createTicket, updateTicketStatus, getAllTickets, updateTicket, deleteTicket } from './tickets'
export { addComment, addNoteComment, deleteComment, updateComment } from './comments'
export { getNotes, getNote, getNoteWithComments, createNote, updateNote, deleteNote } from './notes'

const DB_PATH = path.join(process.cwd(), 'data.db')

let _db: Database.Database | null = null

export function getDb(): Database.Database {
  if (_db) return _db
  _db = new Database(DB_PATH)
  _db.pragma('journal_mode = WAL')
  _db.pragma('foreign_keys = ON')
  initializeSchema(_db)
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
  content: string
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
  comments: Comment[]
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
