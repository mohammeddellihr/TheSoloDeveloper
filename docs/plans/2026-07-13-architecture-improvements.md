# Architecture Improvements Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Deepen shallow modules, eliminate duplication, and delete dead code across the codebase.

**Architecture:** Split the DB monolith into entity-focused modules, extract the redirect guard into a reusable helper, unify 4 delete button components into 1, and delete dead code. Each task is independent and can be built/tested in isolation.

**Tech Stack:** Next.js App Router, better-sqlite3, React, TypeScript

---

### Task 1: Delete dead code

**Files:**
- Delete: `lib/utils.ts`
- Modify: `lib/db.ts:160-163`

**Step 1: Verify utils.ts has zero imports**

Run: `rg "from.*utils" --include="*.ts" --include="*.tsx"`
Expected: Zero matches in source files (only AGENTS.md reference)

**Step 2: Delete lib/utils.ts**

```bash
rm lib/utils.ts
```

**Step 3: Remove the getTicket() shim from lib/db.ts**

Delete lines 160-163:
```typescript
// ponytail: kept old signature for backward compat; callers updated later
export function getTicket(_repositoryId: string, ticketId: string): Ticket | null {
  return getTicketById(ticketId)
}
```

**Step 4: Verify no callers of getTicket()**

Run: `rg "getTicket\(" --include="*.ts" --include="*.tsx" lib/ app/`
Expected: Only `getTicketById` matches, no `getTicket(` calls

**Step 5: Build to verify no breakage**

Run: `npm run build`
Expected: Clean build

**Step 6: Commit**

```bash
git add -A
git commit -m "chore: delete dead code (utils.ts, getTicket shim)"
```

---

### Task 2: Extract the redirect guard

**Files:**
- Modify: `app/actions.ts`

**Step 1: Add the withRedirect helper at the top of actions.ts**

After the imports (line 7), add:

```typescript
function withRedirect(fn: () => void): { error: string } | never {
  try {
    fn()
  } catch (e) {
    if (e instanceof Error && 'digest' in e && typeof e.digest === 'string' && e.digest.startsWith("NEXT_REDIRECT")) throw e
    return { error: "Failed" }
  }
  return { error: "Failed" }
}
```

Wait — the error messages differ per action. Let me revise. The helper needs to accept a custom error message:

```typescript
function withRedirect(errorMessage: string, fn: () => void): { error: string } | never {
  try {
    fn()
  } catch (e) {
    if (e instanceof Error && 'digest' in e && typeof e.digest === 'string' && e.digest.startsWith("NEXT_REDIRECT")) throw e
    return { error: errorMessage }
  }
  return { error: errorMessage }
}
```

Actually, re-reading the actions — `updateTicketStatusAction`, `addCommentAction`, `updateCommentAction`, `deleteCommentAction` don't use redirect, they use `revalidatePath`. So only 7 actions use the redirect pattern. Let me verify which ones:

- `createTicketAction` → redirect ✓
- `updateTicketStatusAction` → revalidatePath only ✗
- `addCommentAction` → revalidatePath only ✗
- `updateCommentAction` → revalidatePath only ✗
- `createRepositoryAction` → redirect ✓
- `updateRepositoryAction` → redirect ✓
- `deleteRepositoryAction` → redirect ✓
- `updateTicketAction` → redirect ✓
- `deleteTicketAction` → redirect ✓
- `createNoteAction` → redirect ✓
- `updateNoteAction` → redirect ✓
- `deleteNoteAction` → redirect ✓
- `deleteCommentAction` → revalidatePath only ✗

That's 9 actions with redirect, 4 without. The helper applies to the 9.

**Step 1: Add withRedirect helper**

After line 7 in `app/actions.ts`:

```typescript
function withRedirect(errorMessage: string, fn: () => void): { error: string } | never {
  try {
    fn()
  } catch (e) {
    if (e instanceof Error && 'digest' in e && typeof e.digest === 'string' && e.digest.startsWith("NEXT_REDIRECT")) throw e
    return { error: errorMessage }
  }
  return { error: errorMessage }
}
```

**Step 2: Refactor createTicketAction**

Replace lines 21-27:
```typescript
  try {
    const ticket = createTicket(repositoryId, title.trim(), typeof content === "string" ? content.trim() : "", validStatus)
    redirect(`/tickets/${ticket.id}`)
  } catch (e) {
    if (e instanceof Error && 'digest' in e && typeof e.digest === 'string' && e.digest.startsWith("NEXT_REDIRECT")) throw e
    return { error: "Failed to create ticket" }
  }
```

With:
```typescript
  return withRedirect("Failed to create ticket", () => {
    const ticket = createTicket(repositoryId, title.trim(), typeof content === "string" ? content.trim() : "", validStatus)
    redirect(`/tickets/${ticket.id}`)
  })
```

**Step 3: Refactor createRepositoryAction**

Replace lines 108-114:
```typescript
  try {
    const repository = createRepository(name, url.trim())
    redirect(`/repositories/${repository.id}`)
  } catch (e) {
    if (e instanceof Error && 'digest' in e && typeof e.digest === 'string' && e.digest.startsWith("NEXT_REDIRECT")) throw e
    return { error: "Failed to create repository" }
  }
```

With:
```typescript
  return withRedirect("Failed to create repository", () => {
    const repository = createRepository(name, url.trim())
    redirect(`/repositories/${repository.id}`)
  })
```

**Step 4: Refactor updateRepositoryAction**

Replace lines 127-134:
```typescript
  try {
    const repository = updateRepository(repositoryId, name, url.trim())
    if (!repository) return { error: "Repository not found" }
    redirect(`/repositories/${repositoryId}`)
  } catch (e) {
    if (e instanceof Error && 'digest' in e && typeof e.digest === 'string' && e.digest.startsWith("NEXT_REDIRECT")) throw e
    return { error: "Failed to update repository" }
  }
```

With:
```typescript
  const repository = updateRepository(repositoryId, name, url.trim())
  if (!repository) return { error: "Repository not found" }
  return withRedirect("Failed to update repository", () => {
    redirect(`/repositories/${repositoryId}`)
  })
```

**Step 5: Refactor deleteRepositoryAction**

Replace lines 144-150:
```typescript
  try {
    deleteRepository(repositoryId)
    redirect("/repositories")
  } catch (e) {
    if (e instanceof Error && 'digest' in e && typeof e.digest === 'string' && e.digest.startsWith("NEXT_REDIRECT")) throw e
    return { error: "Failed to delete repository" }
  }
```

With:
```typescript
  return withRedirect("Failed to delete repository", () => {
    deleteRepository(repositoryId)
    redirect("/repositories")
  })
```

**Step 6: Refactor updateTicketAction**

Replace lines 168-175:
```typescript
  try {
    const ticket = updateTicket(ticketId, title.trim(), typeof content === "string" ? content.trim() : "", status as "pending" | "in_progress" | "completed", repositoryId)
    if (!ticket) return { error: "Ticket not found" }
    redirect(`/tickets/${ticketId}`)
  } catch (e) {
    if (e instanceof Error && 'digest' in e && typeof e.digest === 'string' && e.digest.startsWith("NEXT_REDIRECT")) throw e
    return { error: "Failed to update ticket" }
  }
```

With:
```typescript
  const ticket = updateTicket(ticketId, title.trim(), typeof content === "string" ? content.trim() : "", status as "pending" | "in_progress" | "completed", repositoryId)
  if (!ticket) return { error: "Ticket not found" }
  return withRedirect("Failed to update ticket", () => {
    redirect(`/tickets/${ticketId}`)
  })
```

**Step 7: Refactor deleteTicketAction**

Replace lines 186-192:
```typescript
  try {
    deleteTicket(ticketId)
    redirect("/tickets")
  } catch (e) {
    if (e instanceof Error && 'digest' in e && typeof e.digest === 'string' && e.digest.startsWith("NEXT_REDIRECT")) throw e
    return { error: "Failed to delete ticket" }
  }
```

With:
```typescript
  return withRedirect("Failed to delete ticket", () => {
    deleteTicket(ticketId)
    redirect("/tickets")
  })
```

**Step 8: Refactor createNoteAction**

Replace lines 208-214:
```typescript
  try {
    const note = createNote(title.trim(), typeof content === "string" ? content.trim() : "", keywordList)
    redirect(`/notes/${note.id}`)
  } catch (e) {
    if (e instanceof Error && 'digest' in e && typeof e.digest === 'string' && e.digest.startsWith("NEXT_REDIRECT")) throw e
    return { error: "Failed to create note" }
  }
```

With:
```typescript
  return withRedirect("Failed to create note", () => {
    const note = createNote(title.trim(), typeof content === "string" ? content.trim() : "", keywordList)
    redirect(`/notes/${note.id}`)
  })
```

**Step 9: Refactor updateNoteAction**

Replace lines 231-238:
```typescript
  try {
    const note = updateNote(noteId, title.trim(), typeof content === "string" ? content.trim() : "", keywordList)
    if (!note) return { error: "Note not found" }
    redirect(`/notes/${note.id}`)
  } catch (e) {
    if (e instanceof Error && 'digest' in e && typeof e.digest === 'string' && e.digest.startsWith("NEXT_REDIRECT")) throw e
    return { error: "Failed to update note" }
  }
```

With:
```typescript
  const note = updateNote(noteId, title.trim(), typeof content === "string" ? content.trim() : "", keywordList)
  if (!note) return { error: "Note not found" }
  return withRedirect("Failed to update note", () => {
    redirect(`/notes/${note.id}`)
  })
```

**Step 10: Refactor deleteNoteAction**

Replace lines 248-254:
```typescript
  try {
    deleteNote(noteId)
    redirect("/notes")
  } catch (e) {
    if (e instanceof Error && 'digest' in e && typeof e.digest === 'string' && e.digest.startsWith("NEXT_REDIRECT")) throw e
    return { error: "Failed to delete note" }
  }
```

With:
```typescript
  return withRedirect("Failed to delete note", () => {
    deleteNote(noteId)
    redirect("/notes")
  })
```

**Step 11: Build to verify**

Run: `npm run build`
Expected: Clean build

**Step 12: Commit**

```bash
git add app/actions.ts
git commit -m "refactor: extract withRedirect helper, deduplicate 9 catch blocks"
```

---

### Task 3: Unify delete buttons

**Files:**
- Create: `app/components/ConfirmDeleteButton.tsx`
- Delete: `app/components/DeleteRepositoryButton.tsx`
- Delete: `app/components/DeleteTicketButton.tsx`
- Delete: `app/components/DeleteNoteButton.tsx`
- Modify: `app/components/DeleteButton.tsx` → rewrite to use ConfirmDeleteButton
- Modify: `app/components/UpdateCommentButton.tsx:102` — uses DeleteButton (comment delete)

**Step 1: Create ConfirmDeleteButton.tsx**

```tsx
"use client"

import { useRef, useState } from "react"
import { useActionState } from "react"
import ConfirmModal from "@/app/components/ConfirmModal"

export default function ConfirmDeleteButton({
  action,
  hiddenFields,
  title,
  message,
  label,
  variant = "full",
}: {
  action: (prev: unknown, formData: FormData) => Promise<{ error?: string | null } | undefined | void>
  hiddenFields: Record<string, string>
  title: string
  message: string
  label: string
  variant?: "full" | "icon"
}) {
  const [state, formAction, pending] = useActionState(action, null)
  const [modalOpen, setModalOpen] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  function handleConfirm() {
    setModalOpen(false)
    formRef.current?.requestSubmit()
  }

  return (
    <>
      <form ref={formRef} action={formAction}>
        {Object.entries(hiddenFields).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} />
        ))}
        {state && "error" in state && state.error && (
          <p className="text-sm text-red-500">{state.error}</p>
        )}
        {variant === "full" ? (
          <button
            type="button"
            disabled={pending}
            onClick={() => setModalOpen(true)}
            className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50 cursor-pointer"
          >
            {pending ? "Deleting..." : label}
          </button>
        ) : (
          <button
            type="button"
            disabled={pending}
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              setModalOpen(true)
            }}
            className="rounded p-1 text-gray-400 hover:text-red-400 disabled:opacity-50 cursor-pointer"
            aria-label={label}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
          </button>
        )}
      </form>
      <ConfirmModal
        open={modalOpen}
        title={title}
        message={message}
        onConfirm={handleConfirm}
        onCancel={() => setModalOpen(false)}
      />
    </>
  )
}
```

**Step 2: Replace DeleteRepositoryButton usage**

Find all imports of DeleteRepositoryButton:
Run: `rg "DeleteRepositoryButton" --include="*.tsx"`

Update each file to use ConfirmDeleteButton:
```tsx
<ConfirmDeleteButton
  action={deleteRepositoryAction}
  hiddenFields={{ repositoryId }}
  title="Delete Repository?"
  message="This will also delete all its tickets and comments. This action cannot be undone."
  label="Delete Repository"
/>
```

**Step 3: Replace DeleteTicketButton usage**

Find all imports:
Run: `rg "DeleteTicketButton" --include="*.tsx"`

Update each file:
```tsx
<ConfirmDeleteButton
  action={deleteTicketAction}
  hiddenFields={{ repositoryId, ticketId }}
  title="Delete Ticket?"
  message="This will also delete all its comments. This action cannot be undone."
  label="Delete Ticket"
/>
```

**Step 4: Replace DeleteNoteButton usage**

Find all imports:
Run: `rg "DeleteNoteButton" --include="*.tsx"`

Update each file:
```tsx
<ConfirmDeleteButton
  action={deleteNoteAction}
  hiddenFields={{ noteId }}
  title="Delete Note?"
  message="This note will be permanently deleted."
  label="Delete Note"
/>
```

**Step 5: Rewrite DeleteButton.tsx (comment delete) to use ConfirmDeleteButton**

Replace the entire content of `app/components/DeleteButton.tsx`:

```tsx
"use client"

import { deleteCommentAction } from "@/app/actions"
import ConfirmDeleteButton from "@/app/components/ConfirmDeleteButton"

export default function DeleteButton({
  repositoryId,
  ticketId,
  commentId,
}: {
  repositoryId: string
  ticketId: string
  commentId: string
}) {
  return (
    <ConfirmDeleteButton
      action={deleteCommentAction}
      hiddenFields={{ repositoryId, ticketId, commentId }}
      title="Delete Comment?"
      message="This comment will be permanently deleted."
      label="Delete comment"
      variant="icon"
    />
  )
}
```

**Step 6: Delete the old component files**

```bash
rm app/components/DeleteRepositoryButton.tsx
rm app/components/DeleteTicketButton.tsx
rm app/components/DeleteNoteButton.tsx
```

**Step 7: Build to verify**

Run: `npm run build`
Expected: Clean build

**Step 8: Commit**

```bash
git add -A
git commit -m "refactor: unify 4 delete button components into ConfirmDeleteButton"
```

---

### Task 4: Split DB monolith — create schema module

**Files:**
- Create: `lib/schema.ts`
- Modify: `lib/db.ts`

**Step 1: Create lib/schema.ts**

Extract the schema creation and migrations from db.ts:

```typescript
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
      ticketId TEXT NOT REFERENCES tickets(id) ON DELETE CASCADE,
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
```

**Step 2: Update lib/db.ts to use schema module**

Replace the `getDb()` function body (lines 9-63) to import and call `initializeSchema`:

```typescript
import { initializeSchema } from "./schema"

function getDb(): Database.Database {
  if (_db) return _db
  _db = new Database(DB_PATH)
  _db.pragma('journal_mode = WAL')
  _db.pragma('foreign_keys = ON')
  initializeSchema(_db)
  return _db
}
```

**Step 3: Build to verify**

Run: `npm run build`
Expected: Clean build

**Step 4: Commit**

```bash
git add lib/schema.ts lib/db.ts
git commit -m "refactor: extract schema + migrations to lib/schema.ts"
```

---

### Task 5: Split DB monolith — create entity modules

**Files:**
- Create: `lib/repositories.ts`
- Create: `lib/tickets.ts`
- Create: `lib/comments.ts`
- Create: `lib/notes.ts`
- Modify: `lib/db.ts` — keep getDb, iso, types, re-export from entity modules

**Step 1: Create lib/repositories.ts**

```typescript
import { getDb } from "./db"
import { nanoid } from "nanoid"
import type { Repository } from "./db"

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
```

**Step 2: Create lib/tickets.ts**

```typescript
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
```

**Step 3: Create lib/comments.ts**

```typescript
import { getDb } from "./db"
import { nanoid } from "nanoid"
import type { Comment } from "./db"
import { getTicketById } from "./tickets"

function iso(): string {
  return new Date().toISOString()
}

export function addComment(ticketId: string, text: string): import("./db").Ticket | null {
  const db = getDb()
  const ticket = getTicketById(ticketId)
  if (!ticket) return null
  const id = nanoid()
  const now = iso()
  db.prepare('INSERT INTO comments (id, ticketId, text, createdAt) VALUES (?, ?, ?, ?)').run(id, ticketId, text, now)
  db.prepare('UPDATE tickets SET updatedAt = ? WHERE id = ?').run(now, ticketId)
  return getTicketById(ticketId)
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
```

**Step 4: Create lib/notes.ts**

```typescript
import { getDb } from "./db"
import { nanoid } from "nanoid"
import type { Note } from "./db"

function iso(): string {
  return new Date().toISOString()
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
```

**Step 5: Update lib/db.ts to re-export from entity modules**

Replace the entire file with:

```typescript
import Database from 'better-sqlite3'
import path from 'node:path'
import { initializeSchema } from './schema'

export { getRepositories, getRepository, createRepository, updateRepository, deleteRepository } from './repositories'
export { getTickets, getTicketById, createTicket, updateTicketStatus, getAllTickets, updateTicket, deleteTicket } from './tickets'
export { addComment, deleteComment, updateComment } from './comments'
export { getNotes, getNote, createNote, updateNote, deleteNote } from './notes'

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
```

**Step 6: Build to verify**

Run: `npm run build`
Expected: Clean build

**Step 7: Commit**

```bash
git add -A
git commit -m "refactor: split db.ts into entity modules (repositories, tickets, comments, notes)"
```

---

### Task 6: Extract pagination helper

**Files:**
- Create: `lib/paginate.ts`
- Modify: `app/repositories/page.tsx`
- Modify: `app/tickets/page.tsx`
- Modify: `app/notes/page.tsx`

**Step 1: Create lib/paginate.ts**

```typescript
const DEFAULT_PAGE_SIZE = 12

export function paginate<T>(
  items: T[],
  page: number | string | undefined,
  pageSize: number = DEFAULT_PAGE_SIZE,
): { items: T[]; currentPage: number; totalPages: number } {
  const currentPage = Math.max(1, Number(page) || 1)
  const totalPages = Math.ceil(items.length / pageSize)
  const sliced = items.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  return { items: sliced, currentPage, totalPages }
}
```

**Step 2: Update repositories/page.tsx**

Replace lines 10-21:
```typescript
const PAGE_SIZE = 12

export default async function RepositoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page } = await searchParams
  const allRepositories = getRepositories()
  const currentPage = Math.max(1, Number(page) || 1)
  const totalPages = Math.ceil(allRepositories.length / PAGE_SIZE)
  const repositories = allRepositories.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
```

With:
```typescript
import { paginate } from "@/lib/paginate"

export default async function RepositoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page } = await searchParams
  const { items: repositories, currentPage, totalPages } = paginate(getRepositories(), page)
```

**Step 3: Update tickets/page.tsx**

Replace lines 10-25:
```typescript
const PAGE_SIZE = 12

export default async function TicketsPage({
  searchParams,
}: {
  searchParams: Promise<{ repository_id?: string; status?: string; page?: string }>
}) {
  const params = await searchParams
  const repositories = getRepositories()
  const allTickets = getAllTickets({
    repositoryId: params.repository_id || undefined,
    status: params.status || undefined,
  })
  const currentPage = Math.max(1, Number(params.page) || 1)
  const totalPages = Math.ceil(allTickets.length / PAGE_SIZE)
  const tickets = allTickets.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
```

With:
```typescript
import { paginate } from "@/lib/paginate"

export default async function TicketsPage({
  searchParams,
}: {
  searchParams: Promise<{ repository_id?: string; status?: string; page?: string }>
}) {
  const params = await searchParams
  const repositories = getRepositories()
  const allTickets = getAllTickets({
    repositoryId: params.repository_id || undefined,
    status: params.status || undefined,
  })
  const { items: tickets, currentPage, totalPages } = paginate(allTickets, params.page)
```

**Step 4: Update notes/page.tsx**

Replace lines 10-30:
```typescript
const PAGE_SIZE = 12

export default async function NotesListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const { q, page } = await searchParams
  const term = (q ?? "").toLowerCase().trim()
  const allNotes = getNotes()
  const filtered = term
    ? allNotes.filter(
        (note) =>
          note.keywords.some((k) => k.toLowerCase().includes(term)) ||
          note.title.toLowerCase().includes(term) ||
          note.content.toLowerCase().includes(term),
      )
    : allNotes
  const currentPage = Math.max(1, Number(page) || 1)
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const notes = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
```

With:
```typescript
import { paginate } from "@/lib/paginate"

export default async function NotesListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const { q, page } = await searchParams
  const term = (q ?? "").toLowerCase().trim()
  const allNotes = getNotes()
  const filtered = term
    ? allNotes.filter(
        (note) =>
          note.keywords.some((k) => k.toLowerCase().includes(term)) ||
          note.title.toLowerCase().includes(term) ||
          note.content.toLowerCase().includes(term),
      )
    : allNotes
  const { items: notes, currentPage, totalPages } = paginate(filtered, page)
```

**Step 5: Build to verify**

Run: `npm run build`
Expected: Clean build

**Step 6: Commit**

```bash
git add -A
git commit -m "refactor: extract paginate helper, deduplicate 3 list pages"
```

---

### Task 7: Final lint + build check

**Step 1: Run lint**

Run: `npm run lint`
Expected: 0 errors

**Step 2: Run build**

Run: `npm run build`
Expected: Clean build

**Step 3: Final commit if any fixes needed**

```bash
git add -A
git commit -m "chore: final lint fixes"
```
