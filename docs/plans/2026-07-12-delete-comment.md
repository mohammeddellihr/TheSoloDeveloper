# Delete Comment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a delete button to each comment on the ticket detail page, allowing instant deletion with a single click.

**Architecture:** Add a `deleteComment` DB function, a `deleteCommentAction` server action, and a `DeleteButton` client component that calls the action via `fetch` and revalidates the page.

**Tech Stack:** Next.js App Router, React, Tailwind CSS, Server Actions

## Global Constraints

- No test suite — verification is `npm run build` + `npm run lint`
- Follow existing component patterns
- No comments in code unless asked
- Solo use, no auth

---

### Task 1: Add deleteComment to lib/db.ts

**Files:**
- Modify: `lib/db.ts`

**Interfaces:**
- Consumes: nothing (standalone)
- Produces: `deleteComment(commentId: string): boolean`

- [ ] **Step 1: Add the deleteComment function**

Add to the end of `lib/db.ts` (before the closing of the file):

```ts
export function deleteComment(commentId: string): boolean {
  const result = getDb().prepare('DELETE FROM comments WHERE id = ?').run(commentId)
  return result.changes > 0
}
```

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: Compiles. The function is exported and available.

Run: `npm run lint`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add lib/db.ts
git commit -m "feat: add deleteComment function"
```

---

### Task 2: Add deleteCommentAction to app/actions.ts

**Files:**
- Modify: `app/actions.ts`

**Interfaces:**
- Consumes: `deleteComment` from `@/lib/db`
- Produces: `deleteCommentAction(repositoryId: string, ticketId: string, commentId: string)`

- [ ] **Step 1: Add the server action**

Add to the end of `app/actions.ts` (before the closing of the file):

```ts
export async function deleteCommentAction(_prev: unknown, formData: FormData) {
  const repositoryId = formData.get("repositoryId")
  const ticketId = formData.get("ticketId")
  const commentId = formData.get("commentId")

  if (typeof repositoryId !== "string" || typeof ticketId !== "string" || typeof commentId !== "string") {
    return { error: "Invalid request" }
  }

  try {
    deleteComment(commentId)
    revalidatePath(`/repository/${repositoryId}/ticket/${ticketId}`)
    return { error: null }
  } catch {
    return { error: "Failed to delete comment" }
  }
}
```

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: Compiles. The action is exported and available.

Run: `npm run lint`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add app/actions.ts
git commit -m "feat: add deleteCommentAction server action"
```

---

### Task 3: Create DeleteButton and integrate into ticket page

**Files:**
- Create: `app/components/DeleteButton.tsx`
- Modify: `app/repository/[id]/ticket/[ticketId]/page.tsx`

**Interfaces:**
- Consumes: `deleteCommentAction` from `@/app/actions`
- Produces: `DeleteButton` component — `{ repositoryId: string; ticketId: string; commentId: string }`

- [ ] **Step 1: Create the DeleteButton component**

Create `app/components/DeleteButton.tsx`:

```tsx
"use client"

import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { deleteCommentAction } from "@/app/actions"

export default function DeleteButton({
  repositoryId,
  ticketId,
  commentId,
}: {
  repositoryId: string
  ticketId: string
  commentId: string
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation()
    e.preventDefault()
    const formData = new FormData()
    formData.set("repositoryId", repositoryId)
    formData.set("ticketId", ticketId)
    formData.set("commentId", commentId)
    startTransition(async () => {
      await deleteCommentAction(null, formData)
      router.refresh()
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className="rounded p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 disabled:opacity-50 cursor-pointer"
      aria-label="Delete comment"
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
        <path d="M3 6h18" />
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      </svg>
    </button>
  )
}
```

- [ ] **Step 2: Add DeleteButton to the ticket page**

Modify `app/repository/[id]/ticket/[ticketId]/page.tsx`. Add the import:

```tsx
import DeleteButton from "@/app/components/DeleteButton"
```

Replace the comment card section:

```tsx
        {ticket.comments.map((comment) => (
          <Card key={comment.id}>
            <div className="flex items-start justify-between">
              <p className="text-sm whitespace-pre-wrap">{comment.text}</p>
              <CopyContentButton content={comment.text} />
            </div>
          </Card>
        ))}
```

with:

```tsx
        {ticket.comments.map((comment) => (
          <Card key={comment.id}>
            <div className="flex items-start justify-between">
              <p className="text-sm whitespace-pre-wrap">{comment.text}</p>
              <div className="flex items-center gap-1">
                <CopyContentButton content={comment.text} />
                <DeleteButton repositoryId={repo.id} ticketId={ticket.id} commentId={comment.id} />
              </div>
            </div>
          </Card>
        ))}
```

- [ ] **Step 3: Verify**

Run: `npm run build`
Expected: Compiles. Each comment card shows a copy icon and a trash icon.

Run: `npm run lint`
Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add app/components/DeleteButton.tsx app/repository/[id]/ticket/[ticketId]/page.tsx
git commit -m "feat: add delete button to comment cards"
```

---

## Summary of changes

| File | Change |
|------|--------|
| `lib/db.ts` | Add `deleteComment` function |
| `app/actions.ts` | Add `deleteCommentAction` server action |
| `app/components/DeleteButton.tsx` | New client component — trash icon, instant delete |
| `app/repository/[id]/ticket/[ticketId]/page.tsx` | Add DeleteButton next to CopyContentButton in each comment |
