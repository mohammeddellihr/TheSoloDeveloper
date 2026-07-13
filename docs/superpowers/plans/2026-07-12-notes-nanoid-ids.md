# Notes Nanoid IDs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Change notes from auto-increment integer IDs to nanoid-based string IDs, matching repos/tickets/comments.

**Architecture:** Update the `notes` table schema to use TEXT PRIMARY KEY, change the Note interface, update all DB functions to accept/return string IDs, and update all components that pass note IDs.

**Tech Stack:** Next.js App Router, SQLite (better-sqlite3), nanoid

## Global Constraints

- SQLite via better-sqlite3: all DB functions are synchronous
- Server Actions remain async (Next.js requirement)
- Existing numeric IDs stored as TEXT — no migration needed
- Follow existing code patterns in `lib/db.ts`

---

### Task 1: Migrate Notes to Nanoid IDs

**Files:**
- Modify: `lib/db.ts` (schema, interface, functions)
- Modify: `app/actions.ts` (remove Number() conversions)
- Modify: `app/note/[id]/page.tsx` (remove Number() conversion)
- Modify: `app/note/[id]/update/page.tsx` (remove Number() conversion)
- Modify: `app/components/DeleteNoteButton.tsx` (prop type)

**Interfaces:**
- Consumes: `nanoid` from `nanoid` (already imported in `lib/db.ts`)
- Produces: `Note` interface with `id: string`, updated DB functions

- [ ] **Step 1: Update schema in lib/db.ts**

Change the notes table creation from:
```sql
CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  keywords TEXT NOT NULL DEFAULT '[]',
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);
```

To:
```sql
CREATE TABLE IF NOT EXISTS notes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  keywords TEXT NOT NULL DEFAULT '[]',
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);
```

- [ ] **Step 2: Update Note interface in lib/db.ts**

Change from:
```typescript
export interface Note {
  id: number
  title: string
  content: string
  keywords: string[]
  createdAt: string
  updatedAt: string
}
```

To:
```typescript
export interface Note {
  id: string
  title: string
  content: string
  keywords: string[]
  createdAt: string
  updatedAt: string
}
```

- [ ] **Step 3: Update getNote() function in lib/db.ts**

Change from:
```typescript
export function getNote(id: number): Note | null {
  const row = getDb().prepare('SELECT * FROM notes WHERE id = ?').get(id) as (Omit<Note, 'keywords'> & { keywords: string }) | undefined
  if (!row) return null
  return { ...row, keywords: JSON.parse(row.keywords) }
}
```

To:
```typescript
export function getNote(id: string): Note | null {
  const row = getDb().prepare('SELECT * FROM notes WHERE id = ?').get(id) as (Omit<Note, 'keywords'> & { keywords: string }) | undefined
  if (!row) return null
  return { ...row, keywords: JSON.parse(row.keywords) }
}
```

- [ ] **Step 4: Update createNote() function in lib/db.ts**

Change from:
```typescript
export function createNote(title: string, content: string, keywords: string[]): Note {
  const db = getDb()
  const now = iso()
  const result = db.prepare('INSERT INTO notes (title, content, keywords, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)').run(title, content, JSON.stringify(keywords), now, now)
  return getNote(result.lastInsertRowid as number)!
}
```

To:
```typescript
export function createNote(title: string, content: string, keywords: string[]): Note {
  const db = getDb()
  const id = nanoid()
  const now = iso()
  db.prepare('INSERT INTO notes (id, title, content, keywords, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)').run(id, title, content, JSON.stringify(keywords), now, now)
  return getNote(id)!
}
```

- [ ] **Step 5: Update updateNote() function in lib/db.ts**

Change from:
```typescript
export function updateNote(id: number, title: string, content: string, keywords: string[]): Note | null {
  const db = getDb()
  const now = iso()
  const result = db.prepare('UPDATE notes SET title = ?, content = ?, keywords = ?, updatedAt = ? WHERE id = ?').run(title, content, JSON.stringify(keywords), now, id)
  if (result.changes === 0) return null
  return getNote(id)
}
```

To:
```typescript
export function updateNote(id: string, title: string, content: string, keywords: string[]): Note | null {
  const db = getDb()
  const now = iso()
  const result = db.prepare('UPDATE notes SET title = ?, content = ?, keywords = ?, updatedAt = ? WHERE id = ?').run(title, content, JSON.stringify(keywords), now, id)
  if (result.changes === 0) return null
  return getNote(id)
}
```

- [ ] **Step 6: Update deleteNote() function in lib/db.ts**

Change from:
```typescript
export function deleteNote(id: number): boolean {
  const result = getDb().prepare('DELETE FROM notes WHERE id = ?').run(id)
  return result.changes > 0
}
```

To:
```typescript
export function deleteNote(id: string): boolean {
  const result = getDb().prepare('DELETE FROM notes WHERE id = ?').run(id)
  return result.changes > 0
}
```

- [ ] **Step 7: Update updateNoteAction in app/actions.ts**

Change from:
```typescript
const note = updateNote(Number(noteId), title.trim(), typeof content === "string" ? content.trim() : "", keywordList)
```

To:
```typescript
const note = updateNote(noteId, title.trim(), typeof content === "string" ? content.trim() : "", keywordList)
```

- [ ] **Step 8: Update deleteNoteAction in app/actions.ts**

Change from:
```typescript
deleteNote(Number(noteId))
```

To:
```typescript
deleteNote(noteId)
```

- [ ] **Step 9: Update app/note/[id]/page.tsx**

Change from:
```typescript
const note = getNote(Number(id))
```

To:
```typescript
const note = getNote(id)
```

- [ ] **Step 10: Update app/note/[id]/update/page.tsx**

Change from:
```typescript
const note = getNote(Number(id))
```

To:
```typescript
const note = getNote(id)
```

- [ ] **Step 11: Update DeleteNoteButton.tsx prop type**

Change from:
```typescript
export default function DeleteNoteButton({ noteId }: { noteId: number }) {
```

To:
```typescript
export default function DeleteNoteButton({ noteId }: { noteId: string }) {
```

- [ ] **Step 12: Run build and lint**

Run: `npm run build`
Expected: Build succeeds with no TypeScript errors

Run: `npm run lint`
Expected: No lint errors

- [ ] **Step 13: Commit**

```bash
git add lib/db.ts app/actions.ts app/note/[id]/page.tsx app/note/[id]/update/page.tsx app/components/DeleteNoteButton.tsx
git commit -m "feat: migrate notes from auto-increment IDs to nanoid"
```
