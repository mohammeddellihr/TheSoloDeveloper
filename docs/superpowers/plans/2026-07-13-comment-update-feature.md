# Inline Comment Update Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add inline comment editing to the ticket detail page with an update icon button, textarea editing, and save/cancel functionality.

**Architecture:** Add `updatedAt` column to comments table, create `updateComment()` database function, add `updateCommentAction()` server action, create `UpdateCommentButton` client component with inline edit state, and integrate into the ticket detail page.

**Tech Stack:** Next.js App Router, SQLite via better-sqlite3, React, Tailwind CSS

## Global Constraints

- Dark theme only (no light mode considerations)
- Follow existing patterns (server actions, component structure)
- Use `useTransition` for pending states (like DeleteButton)
- Textarea styling must match CommentForm textarea
- Button variants: primary (white bg) and secondary (black bg)

---

### Task 1: Database Layer — Add updatedAt and updateComment()

**Files:**
- Modify: `lib/db.ts:31-36` (schema), `lib/db.ts:54-58` (Comment interface), add new function

**Interfaces:**
- Consumes: None (standalone database layer)
- Produces: `updateComment(commentId: string, text: string): Comment | null`

- [ ] **Step 1: Add updatedAt column to comments table schema**

In `lib/db.ts`, modify the comments table creation (lines 31-36):

```sql
CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  ticketId TEXT NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT
);
```

- [ ] **Step 2: Add migration for existing databases**

After the existing migration code (line 50), add:

```ts
// ponytail: migration for comments updatedAt column
const commentColumns = _db.prepare("PRAGMA table_info(comments)").all() as { name: string }[]
if (!commentColumns.some(c => c.name === "updatedAt")) {
  _db.exec("ALTER TABLE comments ADD COLUMN updatedAt TEXT")
}
```

- [ ] **Step 3: Update Comment interface**

Replace the Comment interface (lines 54-58):

```ts
export interface Comment {
  id: string
  text: string
  createdAt: string
  updatedAt: string | null
}
```

- [ ] **Step 4: Add updateComment() function**

Add after the `deleteComment` function (after line 269):

```ts
export function updateComment(commentId: string, text: string): Comment | null {
  const db = getDb()
  const now = iso()
  const result = db.prepare('UPDATE comments SET text = ?, updatedAt = ? WHERE id = ?').run(text, now, commentId)
  if (result.changes === 0) return null
  return db.prepare('SELECT * FROM comments WHERE id = ?').get(commentId) as Comment
}
```

- [ ] **Step 5: Update getTickets() to include updatedAt**

Modify the `getTickets` function (lines 118-138) to include `updatedAt` in the comment parsing:

```ts
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
```

- [ ] **Step 6: Update getTicket() to include updatedAt**

The `getTicket` function (lines 140-146) already uses `SELECT *` for comments, so it will automatically include the new `updatedAt` column. No changes needed.

- [ ] **Step 7: Run lint to verify no errors**

Run: `npm run lint`
Expected: PASS

- [ ] **Step 8: Commit**

```bash
git add lib/db.ts
git commit -m "feat: add updatedAt to comments and updateComment() function"
```

---

### Task 2: Server Action — Add updateCommentAction()

**Files:**
- Modify: `app/actions.ts:6` (imports), add new action after line 68

**Interfaces:**
- Consumes: `updateComment()` from `lib/db.ts`
- Produces: `updateCommentAction()` server action

- [ ] **Step 1: Add updateComment to imports**

In `app/actions.ts`, add `updateComment` to the imports (line 6):

```ts
import { createRepository, createTicket, updateTicketStatus, addComment, deleteComment, updateComment, updateRepository, deleteRepository, updateTicket, deleteTicket, createNote, updateNote, deleteNote } from "@/lib/db"
```

- [ ] **Step 2: Add updateCommentAction()**

Add after the `addCommentAction` function (after line 68):

```ts
export async function updateCommentAction(_prev: unknown, formData: FormData) {
  const repositoryId = formData.get("repositoryId")
  const ticketId = formData.get("ticketId")
  const commentId = formData.get("commentId")
  const text = formData.get("text")

  if (typeof repositoryId !== "string" || typeof ticketId !== "string" || typeof commentId !== "string" || typeof text !== "string" || !text.trim()) {
    return { error: "Comment text is required" }
  }

  try {
    const comment = updateComment(commentId, text.trim())
    if (!comment) return { error: "Comment not found" }
    revalidatePath(`/repository/${repositoryId}/ticket/${ticketId}`)
    return { error: null }
  } catch {
    return { error: "Failed to update comment" }
  }
}
```

- [ ] **Step 3: Run lint to verify no errors**

Run: `npm run lint`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add app/actions.ts
git commit -m "feat: add updateCommentAction() server action"
```

---

### Task 3: UI Component — Create UpdateCommentButton and Integrate

**Files:**
- Create: `app/components/UpdateCommentButton.tsx`
- Modify: `app/repository/[id]/ticket/[ticketId]/page.tsx:9-10` (imports), `app/repository/[id]/ticket/[ticketId]/page.tsx:56-66` (comment rendering)

**Interfaces:**
- Consumes: `updateCommentAction()` from `app/actions.ts`
- Produces: `UpdateCommentButton` component used in ticket detail page

- [ ] **Step 1: Create UpdateCommentButton.tsx**

Create `app/components/UpdateCommentButton.tsx`:

```tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { updateCommentAction } from "@/app/actions"
import Button from "@/app/components/Button"

export default function UpdateCommentButton({
  repositoryId,
  ticketId,
  commentId,
  initialText,
}: {
  repositoryId: string
  ticketId: string
  commentId: string
  initialText: string
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(initialText)
  const [error, setError] = useState<string | null>(null)

  function handleSave() {
    if (!text.trim()) {
      setError("Comment cannot be empty")
      return
    }
    const formData = new FormData()
    formData.set("repositoryId", repositoryId)
    formData.set("ticketId", ticketId)
    formData.set("commentId", commentId)
    formData.set("text", text.trim())
    startTransition(async () => {
      const result = await updateCommentAction(null, formData)
      if (result?.error) {
        setError(result.error)
      } else {
        setEditing(false)
        setError(null)
        router.refresh()
      }
    })
  }

  function handleCancel() {
    setText(initialText)
    setEditing(false)
    setError(null)
  }

  if (editing) {
    return (
      <div className="flex flex-col gap-2 w-full">
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            setError(null)
          }}
          rows={3}
          className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          disabled={pending}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={pending}
          >
            {pending ? "Saving..." : "Save"}
          </Button>
          <Button
            variant="secondary"
            onClick={handleCancel}
            disabled={pending}
          >
            Cancel
          </Button>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        e.preventDefault()
        setEditing(true)
      }}
      className="rounded p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
      aria-label="Edit comment"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
      >
        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
        <path d="m15 5 4 4" />
      </svg>
    </button>
  )
}
```

- [ ] **Step 2: Update ticket detail page imports**

In `app/repository/[id]/ticket/[ticketId]/page.tsx`, add the import (after line 10):

```tsx
import UpdateCommentButton from "@/app/components/UpdateCommentButton"
```

- [ ] **Step 3: Update comment rendering**

Replace the comment rendering section (lines 56-66):

```tsx
{ticket.comments.map((comment) => (
  <Card key={comment.id}>
    <div className="flex items-start justify-between">
      <p className="text-sm leading-relaxed whitespace-pre-wrap">{comment.text}</p>
      <div className="flex items-center gap-1">
        <UpdateCommentButton
          repositoryId={repo.id}
          ticketId={ticket.id}
          commentId={comment.id}
          initialText={comment.text}
        />
        <DeleteButton repositoryId={repo.id} ticketId={ticket.id} commentId={comment.id} />
        <CopyContentButton content={comment.text} />
      </div>
    </div>
  </Card>
))}
```

- [ ] **Step 4: Run lint to verify no errors**

Run: `npm run lint`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/components/UpdateCommentButton.tsx app/repository/[id]/ticket/[ticketId]/page.tsx
git commit -m "feat: add inline comment editing with UpdateCommentButton"
```
