# Task 3: Create DeleteButton and integrate into ticket page

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
