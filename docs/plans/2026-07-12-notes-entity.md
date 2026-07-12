# Notes Entity Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a Notes entity with id (int), title, content, and keywords (comma-separated input, stored as JSON array).

**Architecture:** Add notes table to SQLite, CRUD functions in db.ts, server actions, and four pages (list/create/view/update). Keywords stored as JSON string in DB, parsed to array on read.

**Tech Stack:** Next.js App Router, better-sqlite3 (sync), Tailwind CSS, existing Card/Header/Button components.

---

### Task 1: Add notes table + interface + CRUD to db.ts

**Files:**
- Modify: `lib/db.ts`

**Step 1: Add notes table to schema**

In `getDb()`, add to the `CREATE TABLE` exec block (after the comments table):

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

**Step 2: Add Note interface**

After the `Stats` interface (around line 77):

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

**Step 3: Add CRUD functions**

At the end of `lib/db.ts`:

```typescript
export function getNotes(): Note[] {
  const rows = getDb().prepare('SELECT * FROM notes ORDER BY createdAt DESC').all() as (Omit<Note, 'keywords'> & { keywords: string })[]
  return rows.map(r => ({ ...r, keywords: JSON.parse(r.keywords) }))
}

export function getNote(id: number): Note | null {
  const row = getDb().prepare('SELECT * FROM notes WHERE id = ?').get(id) as (Omit<Note, 'keywords'> & { keywords: string }) | undefined
  if (!row) return null
  return { ...row, keywords: JSON.parse(row.keywords) }
}

export function createNote(title: string, content: string, keywords: string[]): Note {
  const db = getDb()
  const now = iso()
  const result = db.prepare('INSERT INTO notes (title, content, keywords, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)').run(title, content, JSON.stringify(keywords), now, now)
  return getNote(result.lastInsertRowid as number)!
}

export function updateNote(id: number, title: string, content: string, keywords: string[]): Note | null {
  const db = getDb()
  const now = iso()
  const result = db.prepare('UPDATE notes SET title = ?, content = ?, keywords = ?, updatedAt = ? WHERE id = ?').run(title, content, JSON.stringify(keywords), now, id)
  if (result.changes === 0) return null
  return getNote(id)
}

export function deleteNote(id: number): boolean {
  const result = getDb().prepare('DELETE FROM notes WHERE id = ?').run(id)
  return result.changes > 0
}
```

**Step 4: Add totalNotes to Stats**

Update `Stats` interface:

```typescript
export interface Stats {
  totalRepos: number
  totalTickets: number
  totalNotes: number
  pending: number
  inProgress: number
  completed: number
}
```

Update `getStats()`:

```typescript
export function getStats(): Stats {
  const db = getDb()
  const totalRepos = (db.prepare('SELECT COUNT(*) as count FROM repositories').get() as { count: number }).count
  const totalTickets = (db.prepare('SELECT COUNT(*) as count FROM tickets').get() as { count: number }).count
  const totalNotes = (db.prepare('SELECT COUNT(*) as count FROM notes').get() as { count: number }).count
  const pending = (db.prepare("SELECT COUNT(*) as count FROM tickets WHERE status = 'pending'").get() as { count: number }).count
  const inProgress = (db.prepare("SELECT COUNT(*) as count FROM tickets WHERE status = 'in_progress'").get() as { count: number }).count
  const completed = (db.prepare("SELECT COUNT(*) as count FROM tickets WHERE status = 'completed'").get() as { count: number }).count
  return { totalRepos, totalTickets, totalNotes, pending, inProgress, completed }
}
```

**Step 5: Verify build**

Run: `npm run build`
Expected: Build succeeds

---

### Task 2: Add server actions for notes

**Files:**
- Modify: `app/actions.ts`

**Step 1: Import note functions**

Add to imports:

```typescript
import { createRepository, createTicket, updateTicketStatus, addComment, updateRepository, deleteRepository, updateTicket, deleteTicket, createNote, updateNote, deleteNote } from "@/lib/db"
```

**Step 2: Add note actions**

At the end of `app/actions.ts`:

```typescript
export async function createNoteAction(_prev: unknown, formData: FormData) {
  const title = formData.get("title")
  const content = formData.get("content")
  const keywords = formData.get("keywords")

  if (typeof title !== "string" || !title.trim()) {
    return { error: "Title is required" }
  }

  const keywordList = typeof keywords === "string" && keywords.trim()
    ? keywords.split(",").map(k => k.trim()).filter(Boolean)
    : []

  try {
    const note = createNote(title.trim(), typeof content === "string" ? content.trim() : "", keywordList)
    redirect(`/note/${note.id}`)
  } catch (e) {
    if (e instanceof Error && 'digest' in e && typeof e.digest === 'string' && e.digest.startsWith("NEXT_REDIRECT")) throw e
    return { error: "Failed to create note" }
  }
}

export async function updateNoteAction(_prev: unknown, formData: FormData) {
  const noteId = formData.get("noteId")
  const title = formData.get("title")
  const content = formData.get("content")
  const keywords = formData.get("keywords")

  if (typeof noteId !== "string" || typeof title !== "string" || !title.trim()) {
    return { error: "Title is required" }
  }

  const keywordList = typeof keywords === "string" && keywords.trim()
    ? keywords.split(",").map(k => k.trim()).filter(Boolean)
    : []

  try {
    const note = updateNote(Number(noteId), title.trim(), typeof content === "string" ? content.trim() : "", keywordList)
    if (!note) return { error: "Note not found" }
    redirect(`/note/${note.id}`)
  } catch (e) {
    if (e instanceof Error && 'digest' in e && typeof e.digest === 'string' && e.digest.startsWith("NEXT_REDIRECT")) throw e
    return { error: "Failed to update note" }
  }
}

export async function deleteNoteAction(_prev: unknown, formData: FormData) {
  const noteId = formData.get("noteId")

  if (typeof noteId !== "string") {
    return { error: "Invalid request" }
  }

  try {
    deleteNote(Number(noteId))
    redirect("/notes")
  } catch (e) {
    if (e instanceof Error && 'digest' in e && typeof e.digest === 'string' && e.digest.startsWith("NEXT_REDIRECT")) throw e
    return { error: "Failed to delete note" }
  }
}
```

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds

---

### Task 3: Add Notes navbar link

**Files:**
- Modify: `app/layout.tsx`

**Step 1: Add Notes link to navbar**

After the Tickets link (around line 37):

```tsx
<Link href="/notes" className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded px-2 py-1 cursor-pointer">
  Notes
</Link>
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds

---

### Task 4: Notes list page

**Files:**
- Create: `app/notes/page.tsx`

**Step 1: Create notes list page**

```tsx
import Link from "next/link"
import { getNotes } from "@/lib/db"
import Header from "@/app/components/Header"
import Card from "@/app/components/Card"
import Button from "@/app/components/Button"

export default async function NotesPage() {
  const notes = getNotes()

  return (
    <>
      <Header
        breadcrumbs={[{ label: "Dashboard", href: "/" }]}
        title="Notes"
        actions={
          <Link href="/notes/create">
            <Button variant="primary">Create Note</Button>
          </Link>
        }
      />

      {notes.length === 0 ? (
        <Card>
          <p className="text-sm text-gray-500">No notes yet.</p>
        </Card>
      ) : (
        <ul className="flex flex-col gap-2">
          {notes.map((note) => (
            <li key={note.id}>
              <Link href={`/note/${note.id}`} className="cursor-pointer hover:opacity-80">
                <Card>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{note.title}</span>
                    {note.keywords.length > 0 && (
                      <div className="flex gap-1">
                        {note.keywords.slice(0, 3).map((kw) => (
                          <span key={kw} className="rounded-full bg-gray-200 dark:bg-gray-700 px-2 py-0.5 text-xs text-gray-600 dark:text-gray-300">
                            {kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds

---

### Task 5: Create note page + form

**Files:**
- Create: `app/notes/create/page.tsx`
- Create: `app/components/CreateNoteForm.tsx`

**Step 1: Create the form component**

```tsx
"use client"

import { useActionState } from "react"
import { createNoteAction } from "@/app/actions"

export default function CreateNoteForm() {
  const [state, action, pending] = useActionState(createNoteAction, null)

  return (
    <form action={action} className="flex flex-col gap-3">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="note-title">Title</label>
      <input
        id="note-title"
        name="title"
        placeholder="Note title"
        required
        className="rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
      />
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="note-content">Content</label>
      <textarea
        id="note-content"
        name="content"
        placeholder="Note content..."
        rows={10}
        className="rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
      />
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="note-keywords">Keywords (comma-separated)</label>
      <input
        id="note-keywords"
        name="keywords"
        placeholder="e.g. react, typescript, nextjs"
        className="rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
      />
      {state && "error" in state && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}
      <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mt-4 flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 disabled:opacity-50 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:focus-visible:outline-white"
        >
          {pending ? "Creating..." : "Create Note"}
        </button>
      </div>
    </form>
  )
}
```

**Step 2: Create the page**

```tsx
import Header from "@/app/components/Header"
import Card from "@/app/components/Card"
import CreateNoteForm from "@/app/components/CreateNoteForm"

export default function NewNotePage() {
  return (
    <>
      <Header
        breadcrumbs={[{ label: "Notes", href: "/notes" }]}
        title="Create Note"
      />
      <Card>
        <h1 className="text-xl font-bold border-b border-gray-200 dark:border-gray-800 pb-4">Create Note</h1>
        <div className="pt-4">
          <CreateNoteForm />
        </div>
      </Card>
    </>
  )
}
```

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds

---

### Task 6: View note page

**Files:**
- Create: `app/note/[id]/page.tsx`

**Step 1: Create view page**

```tsx
import Link from "next/link"
import { notFound } from "next/navigation"
import { getNote } from "@/lib/db"
import Header from "@/app/components/Header"
import Card from "@/app/components/Card"
import Button from "@/app/components/Button"

export default async function NotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const note = getNote(Number(id))
  if (!note) notFound()

  return (
    <>
      <Header
        breadcrumbs={[{ label: "Notes", href: "/notes" }]}
        title={`Note #${note.id}`}
        actions={
          <Link href={`/note/${note.id}/update`}>
            <Button variant="secondary" className="border-0 hover:bg-gray-100 dark:hover:bg-gray-800">Update</Button>
          </Link>
        }
      />

      <Card>
        <div className={`flex items-center justify-between ${note.content ? "border-b border-gray-200 dark:border-gray-800 pb-4" : ""}`}>
          <h1 className="text-xl font-bold">{note.title}</h1>
          {note.keywords.length > 0 && (
            <div className="flex gap-1">
              {note.keywords.map((kw) => (
                <span key={kw} className="rounded-full bg-gray-200 dark:bg-gray-700 px-2 py-0.5 text-xs text-gray-600 dark:text-gray-300">
                  {kw}
                </span>
              ))}
            </div>
          )}
        </div>
        {note.content && (
          <div className="pt-4">
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{note.content}</p>
          </div>
        )}
      </Card>
    </>
  )
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds

---

### Task 7: Update note page + form

**Files:**
- Create: `app/note/[id]/update/page.tsx`
- Create: `app/components/UpdateNoteForm.tsx`
- Create: `app/components/DeleteNoteButton.tsx`

**Step 1: Create DeleteNoteButton**

```tsx
"use client"

import { useActionState } from "react"
import { deleteNoteAction } from "@/app/actions"

export default function DeleteNoteButton({ noteId }: { noteId: number }) {
  const [, action, pending] = useActionState(deleteNoteAction, undefined)

  return (
    <form action={action}>
      <input type="hidden" name="noteId" value={noteId} />
      <button
        type="submit"
        disabled={pending}
        className="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        {pending ? "Deleting..." : "Delete"}
      </button>
    </form>
  )
}
```

**Step 2: Create UpdateNoteForm**

```tsx
"use client"

import { useActionState } from "react"
import { updateNoteAction } from "@/app/actions"

export default function UpdateNoteForm({
  noteId,
  title,
  content,
  keywords,
}: {
  noteId: number
  title: string
  content: string
  keywords: string[]
}) {
  const [state, action, pending] = useActionState(updateNoteAction, null)

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="noteId" value={noteId} />
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="note-title">Title</label>
      <input
        id="note-title"
        name="title"
        placeholder="Note title"
        defaultValue={title}
        required
        className="rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
      />
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="note-content">Content</label>
      <textarea
        id="note-content"
        name="content"
        placeholder="Note content..."
        defaultValue={content}
        rows={10}
        className="rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
      />
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="note-keywords">Keywords (comma-separated)</label>
      <input
        id="note-keywords"
        name="keywords"
        placeholder="e.g. react, typescript, nextjs"
        defaultValue={keywords.join(", ")}
        className="rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
      />
      {state && "error" in state && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}
      <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mt-4 flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 disabled:opacity-50 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:focus-visible:outline-white"
        >
          {pending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  )
}
```

**Step 3: Create update page**

```tsx
import { notFound } from "next/navigation"
import { getNote } from "@/lib/db"
import Header from "@/app/components/Header"
import Card from "@/app/components/Card"
import DeleteNoteButton from "@/app/components/DeleteNoteButton"
import UpdateNoteForm from "@/app/components/UpdateNoteForm"

export default async function UpdateNotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const note = getNote(Number(id))
  if (!note) notFound()

  return (
    <>
      <Header
        breadcrumbs={[{ label: "Notes", href: "/notes" }]}
        title="Update Note"
        actions={<DeleteNoteButton noteId={note.id} />}
      />
      <Card>
        <h1 className="text-xl font-bold border-b border-gray-200 dark:border-gray-800 pb-4">Update Note</h1>
        <div className="pt-4">
          <UpdateNoteForm
            noteId={note.id}
            title={note.title}
            content={note.content}
            keywords={note.keywords}
          />
        </div>
      </Card>
    </>
  )
}
```

**Step 4: Verify build**

Run: `npm run build`
Expected: Build succeeds

---

### Task 8: Add Notes card to dashboard

**Files:**
- Modify: `app/page.tsx`

**Step 1: Add Notes stat card**

In the `statCards` array, add after Total Tickets:

```typescript
{ label: "Notes", value: stats.totalNotes, href: "/notes" },
```

Update grid to accommodate 6 cards: `grid-cols-2 sm:grid-cols-3 lg:grid-cols-6`

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Verify lint**

Run: `npm run lint`
Expected: No errors
