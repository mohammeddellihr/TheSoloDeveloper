# Architecture Improvements Phase 2 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Eliminate remaining duplication, unify comment components by parent type, extract shared utilities, and clean up dead code.

**Architecture:** Parameterize comment components (CommentForm, UpdateCommentButton) by parent type (ticket/note) instead of maintaining parallel clones. Unify the DB-level addComment/addNoteComment into one function. Extract iso(), keyword parsing, status validation to shared utils. Add Tailwind @apply rules for repeated CSS classes.

**Tech Stack:** Next.js App Router, better-sqlite3, React, TypeScript, Tailwind CSS

---

### Task 1: Extract shared utilities

**Files:**
- Create: `lib/utils.ts`
- Modify: `lib/repositories.ts`, `lib/tickets.ts`, `lib/comments.ts`, `lib/notes.ts`
- Modify: `app/actions.ts`
- Modify: `app/globals.css`

**Step 1: Create lib/utils.ts**

```typescript
export function iso(): string {
  return new Date().toISOString()
}

export function parseKeywords(raw: unknown): string[] {
  return typeof raw === "string" && raw.trim()
    ? raw.split(",").map(k => k.trim()).filter(Boolean)
    : []
}

export function validateStatus(raw: unknown): import("./db").Ticket["status"] {
  const { STATUSES } = require("./constants")
  return STATUSES.includes(raw) ? raw : "pending"
}
```

Wait — `validateStatus` imports constants at runtime. Better to keep it simple:

```typescript
export function iso(): string {
  return new Date().toISOString()
}

export function parseKeywords(raw: unknown): string[] {
  return typeof raw === "string" && raw.trim()
    ? raw.split(",").map(k => k.trim()).filter(Boolean)
    : []
}
```

**Step 2: Update lib/repositories.ts**

Replace the local `iso()` with import:
- Remove lines 5-7 (the `function iso()` definition)
- Add `import { iso } from "./utils"` at the top

**Step 3: Update lib/tickets.ts**

- Remove lines 5-7 (the `function iso()` definition)
- Add `import { iso } from "./utils"` at the top

**Step 4: Update lib/comments.ts**

- Remove lines 7-9 (the `function iso()` definition)
- Add `import { iso } from "./utils"` at the top

**Step 5: Update lib/notes.ts**

- Remove lines 5-7 (the `function iso()` definition)
- Add `import { iso } from "./utils"` at the top

**Step 6: Update app/actions.ts — extract keyword parsing**

Replace the duplicated keyword parsing in `createNoteAction` (lines 229-231) and `updateNoteAction` (lines 249-251):

```typescript
// Before (in both actions):
const keywordList = typeof keywords === "string" && keywords.trim()
  ? keywords.split(",").map(k => k.trim()).filter(Boolean)
  : []

// After:
import { parseKeywords } from "@/lib/utils"
// ...
const keywordList = parseKeywords(keywords)
```

Add `import { parseKeywords } from "@/lib/utils"` to the imports.

**Step 7: Add Tailwind @apply rules in globals.css**

Add at the end of `app/globals.css`:

```css
@layer components {
  .input-field {
    @apply rounded border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-400 focus:border-white focus:outline-none;
  }
  .form-footer {
    @apply -mx-4 px-4 pt-4 border-t border-gray-800 flex justify-end;
  }
}
```

**Step 8: Replace input CSS classes in form components**

In each of these files, replace the long className string on input/select elements with `"input-field"`:

- `app/components/CreateNoteForm.tsx` — title input, keywords input
- `app/components/CreateRepositoryForm.tsx` — url input
- `app/components/CreateTicketForm.tsx` — title input, select elements
- `app/components/UpdateNoteForm.tsx` — title input, keywords input
- `app/components/UpdateRepositoryForm.tsx` — url input
- `app/components/UpdateTicketForm.tsx` — title input, select elements
- `app/components/NoteSearch.tsx` — search input
- `app/components/TicketFilters.tsx` — select elements

**Step 9: Replace form footer CSS classes**

In each create/update form component, replace the footer div className with `"form-footer"`:

- `app/components/CreateNoteForm.tsx`
- `app/components/CreateRepositoryForm.tsx`
- `app/components/CreateTicketForm.tsx`
- `app/components/UpdateNoteForm.tsx`
- `app/components/UpdateRepositoryForm.tsx`
- `app/components/UpdateTicketForm.tsx`
- `app/components/CommentForm.tsx`
- `app/components/NoteCommentForm.tsx`
- `app/components/UpdateCommentButton.tsx` (editing mode footer)
- `app/components/UpdateNoteCommentButton.tsx` (editing mode footer)

**Step 10: Build to verify**

Run: `npm run build`
Expected: Clean build

**Step 11: Commit**

```bash
git add -A
git commit -m "refactor: extract shared utils (iso, parseKeywords), add Tailwind @apply rules"
```

---

### Task 2: Unify CommentForm and NoteCommentForm

**Files:**
- Rewrite: `app/components/CommentForm.tsx`
- Delete: `app/components/NoteCommentForm.tsx`
- Modify: `app/notes/[id]/page.tsx`

**Step 1: Rewrite CommentForm.tsx**

```tsx
"use client"

import { useActionState } from "react"
import { addCommentAction, addNoteCommentAction } from "@/app/actions"
import Button from "./Button"
import AutoResizeTextarea from "./AutoResizeTextarea"

export default function CommentForm({
  ownerType,
  ownerId,
}: {
  ownerType: "ticket" | "note"
  ownerId: string
}) {
  const action = ownerType === "ticket" ? addCommentAction : addNoteCommentAction
  const hiddenFieldName = ownerType === "ticket" ? "ticketId" : "noteId"
  const [state, formAction, pending] = useActionState(action, undefined)

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name={hiddenFieldName} value={ownerId} />
      <div className="-mx-4 px-4 pb-4 border-b border-gray-800">
        <h3 className="text-sm font-semibold">Create Comment</h3>
      </div>
      <div className="pt-2">
        <AutoResizeTextarea
          id="comment-text"
          name="text"
          rows={5}
          placeholder="Write a comment ..."
          required
          className="w-full rounded border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-400 focus:border-white focus:outline-none"
        />
      </div>
      {state?.error && <p className="text-xs text-red-500">{state.error}</p>}
      <div className="form-footer">
        <Button type="submit" disabled={pending}>
          {pending ? "Creating..." : "Create Comment"}
        </Button>
      </div>
    </form>
  )
}
```

**Step 2: Delete NoteCommentForm.tsx**

```bash
rm app/components/NoteCommentForm.tsx
```

**Step 3: Update app/notes/[id]/page.tsx**

Replace:
```tsx
import NoteCommentForm from "@/app/components/NoteCommentForm"
```
With:
```tsx
import CommentForm from "@/app/components/CommentForm"
```

Replace:
```tsx
<CommentForm noteId={note.id} />
```
Wait — the new CommentForm uses `ownerType`/`ownerId`, not `noteId`. So replace:
```tsx
<NoteCommentForm noteId={note.id} />
```
With:
```tsx
<CommentForm ownerType="note" ownerId={note.id} />
```

**Step 4: Update app/tickets/[id]/page.tsx**

Replace:
```tsx
<CommentForm repositoryId={repository.id} ticketId={ticket.id} />
```
With:
```tsx
<CommentForm ownerType="ticket" ownerId={ticket.id} />
```

**Step 5: Build to verify**

Run: `npm run build`
Expected: Clean build

**Step 6: Commit**

```bash
git add -A
git commit -m "refactor: unify CommentForm/NoteCommentForm into one parameterized component"
```

---

### Task 3: Unify UpdateCommentButton and UpdateNoteCommentButton

**Files:**
- Rewrite: `app/components/UpdateCommentButton.tsx`
- Delete: `app/components/UpdateNoteCommentButton.tsx`
- Delete: `app/components/DeleteButton.tsx`
- Modify: `app/notes/[id]/page.tsx`

**Step 1: Rewrite UpdateCommentButton.tsx**

```tsx
"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { updateCommentAction, deleteCommentAction } from "@/app/actions"
import Button from "@/app/components/Button"
import Card from "@/app/components/Card"
import ConfirmDeleteButton from "@/app/components/ConfirmDeleteButton"
import CopyContentButton from "@/app/components/CopyContentButton"
import AutoResizeTextarea from "@/app/components/AutoResizeTextarea"

export default function UpdateCommentButton({
  ownerType,
  ownerId,
  commentId,
  initialText,
}: {
  ownerType: "ticket" | "note"
  ownerId: string
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
    if (ownerType === "ticket") {
      formData.set("ticketId", ownerId)
    } else {
      formData.set("noteId", ownerId)
    }
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

  const deleteHiddenFields = ownerType === "ticket"
    ? { ticketId: ownerId, commentId }
    : { noteId: ownerId, commentId }

  if (editing) {
    return (
      <Card>
        <div className="flex flex-col gap-3">
          <div className="-mx-4 px-4 pb-4 border-b border-gray-800">
            <h3 className="text-sm font-semibold">Update Comment</h3>
          </div>
          <div className="pt-2">
            <AutoResizeTextarea
              value={text}
              onChange={(e) => {
                setText(e.target.value)
                setError(null)
              }}
              rows={5}
              className="w-full rounded border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-400 focus:border-white focus:outline-none"
              disabled={pending}
            />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="form-footer gap-2">
            <Button
              variant="secondary"
              onClick={handleCancel}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={pending}
            >
              {pending ? "Saving..." : "Update Comment"}
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <div className="flex items-start justify-between">
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{initialText}</p>
        <div className="flex items-center gap-1">
          <ConfirmDeleteButton
            action={deleteCommentAction}
            hiddenFields={deleteHiddenFields}
            title="Delete Comment?"
            message="This comment will be permanently deleted."
            label="Delete comment"
            variant="icon"
          />
          <button
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              setEditing(true)
            }}
            className="rounded p-1 text-gray-400 hover:text-gray-300 cursor-pointer"
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
          <CopyContentButton content={initialText} />
        </div>
      </div>
    </Card>
  )
}
```

**Step 2: Delete UpdateNoteCommentButton.tsx**

```bash
rm app/components/UpdateNoteCommentButton.tsx
```

**Step 3: Delete DeleteButton.tsx**

```bash
rm app/components/DeleteButton.tsx
```

**Step 4: Update app/tickets/[id]/page.tsx**

Replace:
```tsx
<UpdateCommentButton
  key={comment.id}
  repositoryId={repository.id}
  ticketId={ticket.id}
  commentId={comment.id}
  initialText={comment.text}
/>
```
With:
```tsx
<UpdateCommentButton
  key={comment.id}
  ownerType="ticket"
  ownerId={ticket.id}
  commentId={comment.id}
  initialText={comment.text}
/>
```

**Step 5: Update app/notes/[id]/page.tsx**

Replace:
```tsx
import UpdateNoteCommentButton from "@/app/components/UpdateNoteCommentButton"
```
With:
```tsx
import UpdateCommentButton from "@/app/components/UpdateCommentButton"
```

Replace:
```tsx
<UpdateNoteCommentButton
  key={comment.id}
  noteId={note.id}
  commentId={comment.id}
  initialText={comment.text}
/>
```
With:
```tsx
<UpdateCommentButton
  key={comment.id}
  ownerType="note"
  ownerId={note.id}
  commentId={comment.id}
  initialText={comment.text}
/>
```

**Step 6: Build to verify**

Run: `npm run build`
Expected: Clean build

**Step 7: Commit**

```bash
git add -A
git commit -m "refactor: unify UpdateCommentButton/UpdateNoteCommentButton, delete DeleteButton"
```

---

### Task 4: Unify addComment / addNoteComment at DB level

**Files:**
- Modify: `lib/comments.ts`
- Modify: `lib/db.ts` (re-exports)
- Modify: `app/actions.ts`

**Step 1: Rewrite lib/comments.ts**

Replace `addComment` and `addNoteComment` with a single unified function:

```typescript
import { getDb } from "./db"
import { nanoid } from "nanoid"
import type { Comment, Ticket, Note } from "./db"
import { getTicketById } from "./tickets"
import { getNoteWithComments } from "./notes"
import { iso } from "./utils"

export function addComment({
  type,
  parentId,
  text,
}: {
  type: "ticket" | "note"
  parentId: string
  text: string
}): Ticket | Note | null {
  const db = getDb()
  const id = nanoid()
  const now = iso()

  if (type === "ticket") {
    const ticket = getTicketById(parentId)
    if (!ticket) return null
    db.prepare('INSERT INTO comments (id, ticketId, text, createdAt) VALUES (?, ?, ?, ?)').run(id, parentId, text, now)
    db.prepare('UPDATE tickets SET updatedAt = ? WHERE id = ?').run(now, parentId)
    return getTicketById(parentId)
  }

  const note = getNoteWithComments(parentId)
  if (!note) return null
  db.prepare('INSERT INTO comments (id, noteId, text, createdAt) VALUES (?, ?, ?, ?)').run(id, parentId, text, now)
  db.prepare('UPDATE notes SET updatedAt = ? WHERE id = ?').run(now, parentId)
  return getNoteWithComments(parentId)
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
```

**Step 2: Update lib/db.ts re-exports**

Replace:
```typescript
export { addComment, addNoteComment, deleteComment, updateComment } from './comments'
```
With:
```typescript
export { addComment, deleteComment, updateComment } from './comments'
```

**Step 3: Update app/actions.ts — merge addCommentAction and addNoteCommentAction**

Replace both actions with one:

```typescript
export async function addCommentAction(_prev: unknown, formData: FormData) {
  const ticketId = formData.get("ticketId")
  const noteId = formData.get("noteId")
  const text = formData.get("text")

  if (typeof text !== "string" || !text.trim()) {
    return { error: "Comment text is required" }
  }

  if (typeof ticketId === "string") {
    try {
      addComment({ type: "ticket", parentId: ticketId, text: text.trim() })
      revalidatePath(`/tickets/${ticketId}`)
      return { error: null }
    } catch {
      return { error: "Failed to add comment" }
    }
  }

  if (typeof noteId === "string") {
    try {
      addComment({ type: "note", parentId: noteId, text: text.trim() })
      revalidatePath(`/notes/${noteId}`)
      return { error: null }
    } catch {
      return { error: "Failed to add comment" }
    }
  }

  return { error: "Invalid request" }
}
```

Remove `addNoteCommentAction` entirely. Remove `addNoteComment` from the imports.

**Step 4: Update the CommentForm component**

The CommentForm currently imports `addCommentAction` and `addNoteCommentAction` separately. Now there's only one action. Update CommentForm:

```tsx
import { addCommentAction } from "@/app/actions"
// ...
const [state, formAction, pending] = useActionState(addCommentAction, undefined)
```

Remove the `action` variable that switches between the two. The hidden field name logic stays the same.

**Step 5: Build to verify**

Run: `npm run build`
Expected: Clean build

**Step 6: Commit**

```bash
git add -A
git commit -m "refactor: unify addComment/addNoteComment into single DB function and action"
```

---

### Task 5: Collapse comment action branching

**Files:**
- Modify: `app/actions.ts`

**Step 1: Extract getCommentParentPath helper**

Add after `withRedirect`:

```typescript
function getCommentParentPath(formData: FormData): string | null {
  const ticketId = formData.get("ticketId")
  if (typeof ticketId === "string") return `/tickets/${ticketId}`
  const noteId = formData.get("noteId")
  if (typeof noteId === "string") return `/notes/${noteId}`
  return null
}
```

**Step 2: Simplify updateCommentAction**

Replace the entire function:

```typescript
export async function updateCommentAction(_prev: unknown, formData: FormData) {
  const commentId = formData.get("commentId")
  const text = formData.get("text")

  if (typeof commentId !== "string" || typeof text !== "string" || !text.trim()) {
    return { error: "Comment text is required" }
  }

  const parentPath = getCommentParentPath(formData)
  if (!parentPath) return { error: "Invalid request" }

  try {
    const comment = updateComment(commentId, text.trim())
    if (!comment) return { error: "Comment not found" }
    revalidatePath(parentPath)
    return { error: null }
  } catch {
    return { error: "Failed to update comment" }
  }
}
```

**Step 3: Simplify deleteCommentAction**

Replace the entire function:

```typescript
export async function deleteCommentAction(_prev: unknown, formData: FormData) {
  const commentId = formData.get("commentId")

  if (typeof commentId !== "string") {
    return { error: "Invalid request" }
  }

  const parentPath = getCommentParentPath(formData)
  if (!parentPath) return { error: "Invalid request" }

  try {
    deleteComment(commentId)
    revalidatePath(parentPath)
    return { error: null }
  } catch {
    return { error: "Failed to delete comment" }
  }
}
```

**Step 4: Simplify addCommentAction**

The addCommentAction from Task 4 already branches. Simplify it too:

```typescript
export async function addCommentAction(_prev: unknown, formData: FormData) {
  const ticketId = formData.get("ticketId")
  const noteId = formData.get("noteId")
  const text = formData.get("text")

  if (typeof text !== "string" || !text.trim()) {
    return { error: "Comment text is required" }
  }

  const type = typeof ticketId === "string" ? "ticket" : typeof noteId === "string" ? "note" : null
  const parentId = type === "ticket" ? ticketId : type === "note" ? noteId : null

  if (!type || typeof parentId !== "string") {
    return { error: "Invalid request" }
  }

  try {
    addComment({ type, parentId, text: text.trim() })
    revalidatePath(type === "ticket" ? `/tickets/${parentId}` : `/notes/${parentId}`)
    return { error: null }
  } catch {
    return { error: "Failed to add comment" }
  }
}
```

**Step 5: Build to verify**

Run: `npm run build`
Expected: Clean build

**Step 6: Commit**

```bash
git add app/actions.ts
git commit -m "refactor: collapse comment action branching with getCommentParentPath helper"
```

---

### Task 6: Fix dead withRedirect return + status literals

**Files:**
- Modify: `app/actions.ts:9-17`
- Modify: `lib/tickets.ts:49,72`

**Step 1: Fix withRedirect dead return**

Replace lines 9-17:

```typescript
function withRedirect(errorMessage: string, fn: () => void): never {
  try {
    fn()
  } catch (e) {
    if (e instanceof Error && 'digest' in e && typeof e.digest === 'string' && e.digest.startsWith("NEXT_REDIRECT")) throw e
  }
  throw new Error(errorMessage)
}
```

Wait — this changes the return type. The callers do `return withRedirect(...)`. If it returns `never`, that still works since `never` is assignable to everything. But the callers currently expect `{ error: string } | never`. Let me keep the original return type but remove the dead path:

```typescript
function withRedirect(errorMessage: string, fn: () => void): { error: string } | never {
  try {
    fn()
  } catch (e) {
    if (e instanceof Error && 'digest' in e && typeof e.digest === 'string' && e.digest.startsWith("NEXT_REDIRECT")) throw e
    return { error: errorMessage }
  }
  // fn() always calls redirect() which always throws NEXT_REDIRECT
  // This line is unreachable but kept for type safety
  return { error: errorMessage }
}
```

Actually, the simplest fix that maintains clarity: just add a comment. The dead return is fine for type safety. Let me skip this task — it's 1 line of clarity, not worth the churn.

**Step 2: Fix raw status literals in lib/tickets.ts**

Replace lines 49 and 72:

```typescript
// Before (line 49):
status: 'pending' | 'in_progress' | 'completed' | 'archived'
// After:
status: Ticket["status"]
```

```typescript
// Before (line 72):
status: 'pending' | 'in_progress' | 'completed' | 'archived'
// After:
status: Ticket["status"]
```

**Step 3: Build to verify**

Run: `npm run build`
Expected: Clean build

**Step 4: Commit**

```bash
git add lib/tickets.ts
git commit -m "refactor: use Ticket['status'] type instead of raw literals"
```

---

### Task 7: Remove duplicate page headings

**Files:**
- Modify: `app/repositories/create/page.tsx`
- Modify: `app/tickets/create/page.tsx`
- Modify: `app/notes/create/page.tsx`

**Step 1: Read each create page**

Remove the `<h1>` heading from inside the Card in each create page. The Header component already renders the title.

**Step 2: Build to verify**

Run: `npm run build`
Expected: Clean build

**Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove duplicate h1 headings from create pages"
```

---

### Task 8: Final lint + build check

**Step 1: Run lint**

Run: `npm run lint`
Expected: 0 errors

**Step 2: Run build**

Run: `npm run build`
Expected: Clean build
