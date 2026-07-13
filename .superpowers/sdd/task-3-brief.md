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
