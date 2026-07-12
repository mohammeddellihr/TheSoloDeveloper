# Delete Confirmation Modal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a confirmation modal to every delete button so no delete fires without explicit user confirmation.

**Architecture:** Create a reusable `ConfirmModal` client component. Each of the 4 delete buttons manages its own modal state via `useState`. The modal is a simple center popup with dark overlay, title, message, Cancel + red Delete buttons.

**Tech Stack:** React 19, Next.js App Router, Tailwind CSS 4, TypeScript

## Global Constraints

- No test suite — verification via `npm run build` + `npm run lint`
- No git commits — all git commands are skipped
- Solo use, no auth
- Node.js path: `& "C:\Program Files\nodejs\npm.cmd" run build`
- Follow existing component patterns (see `Button.tsx`, `Card.tsx`)

---

### Task 1: Create ConfirmModal Component

**Files:**
- Create: `app/components/ConfirmModal.tsx`

**Interfaces:**
- Consumes: `Button` from `@/app/components/Button`
- Produces: `ConfirmModal` component with `{ open, title, message, confirmLabel?, onConfirm, onCancel }` props

- [ ] **Step 1: Create the ConfirmModal component**

Create `app/components/ConfirmModal.tsx`:

```tsx
"use client"

import { useEffect } from "react"
import Button from "@/app/components/Button"

interface ConfirmModalProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  useEffect(() => {
    if (!open) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onCancel}
    >
      <div
        className="rounded-lg bg-white p-6 shadow-xl dark:bg-gray-900 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {message}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <button
            onClick={onConfirm}
            className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 cursor-pointer"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify**

Run: `& "C:\Program Files\nodejs\npm.cmd" run build`
Expected: Compiles. ConfirmModal is exported and available.

Run: `& "C:\Program Files\nodejs\npm.cmd" run lint`
Expected: No errors.

---

### Task 2: Integrate ConfirmModal into All Delete Buttons

**Files:**
- Modify: `app/components/DeleteButton.tsx`
- Modify: `app/components/DeleteRepoButton.tsx`
- Modify: `app/components/DeleteTicketButton.tsx`
- Modify: `app/components/DeleteNoteButton.tsx`

**Interfaces:**
- Consumes: `ConfirmModal` from `@/app/components/ConfirmModal`
- Produces: updated versions of all 4 delete buttons with confirmation modals

- [ ] **Step 1: Update DeleteButton (comments)**

Replace the contents of `app/components/DeleteButton.tsx`:

```tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { deleteCommentAction } from "@/app/actions"
import ConfirmModal from "@/app/components/ConfirmModal"

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
  const [modalOpen, setModalOpen] = useState(false)

  function handleConfirm() {
    setModalOpen(false)
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
    <>
      <button
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
          setModalOpen(true)
        }}
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
      <ConfirmModal
        open={modalOpen}
        title="Delete Comment?"
        message="This comment will be permanently deleted."
        onConfirm={handleConfirm}
        onCancel={() => setModalOpen(false)}
      />
    </>
  )
}
```

- [ ] **Step 2: Update DeleteRepoButton**

Replace the contents of `app/components/DeleteRepoButton.tsx`:

```tsx
"use client"

import { useRef, useState } from "react"
import { useActionState } from "react"
import { deleteRepositoryAction } from "@/app/actions"
import Button from "@/app/components/Button"
import ConfirmModal from "@/app/components/ConfirmModal"

export default function DeleteRepoButton({ repositoryId }: { repositoryId: string }) {
  const [state, action, pending] = useActionState(deleteRepositoryAction, null)
  const [modalOpen, setModalOpen] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  function handleConfirm() {
    setModalOpen(false)
    formRef.current?.requestSubmit()
  }

  return (
    <>
      <form ref={formRef} action={action}>
        <input type="hidden" name="repositoryId" value={repositoryId} />
        {state && "error" in state && (
          <p className="text-sm text-red-500">{state.error}</p>
        )}
        <Button
          type="button"
          disabled={pending}
          onClick={() => setModalOpen(true)}
        >
          {pending ? "Deleting..." : "Delete Repository"}
        </Button>
      </form>
      <ConfirmModal
        open={modalOpen}
        title="Delete Repository?"
        message="This will also delete all its tickets and comments. This action cannot be undone."
        onConfirm={handleConfirm}
        onCancel={() => setModalOpen(false)}
      />
    </>
  )
}
```

- [ ] **Step 3: Update DeleteTicketButton**

Replace the contents of `app/components/DeleteTicketButton.tsx`:

```tsx
"use client"

import { useRef, useState } from "react"
import { useActionState } from "react"
import { deleteTicketAction } from "@/app/actions"
import Button from "@/app/components/Button"
import ConfirmModal from "@/app/components/ConfirmModal"

export default function DeleteTicketButton({ repositoryId, ticketId }: { repositoryId: string; ticketId: string }) {
  const [state, action, pending] = useActionState(deleteTicketAction, null)
  const [modalOpen, setModalOpen] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  function handleConfirm() {
    setModalOpen(false)
    formRef.current?.requestSubmit()
  }

  return (
    <>
      <form ref={formRef} action={action}>
        <input type="hidden" name="repositoryId" value={repositoryId} />
        <input type="hidden" name="ticketId" value={ticketId} />
        {state && "error" in state && (
          <p className="text-sm text-red-500">{state.error}</p>
        )}
        <Button
          type="button"
          disabled={pending}
          onClick={() => setModalOpen(true)}
        >
          {pending ? "Deleting..." : "Delete Ticket"}
        </Button>
      </form>
      <ConfirmModal
        open={modalOpen}
        title="Delete Ticket?"
        message="This will also delete all its comments. This action cannot be undone."
        onConfirm={handleConfirm}
        onCancel={() => setModalOpen(false)}
      />
    </>
  )
}
```

- [ ] **Step 4: Update DeleteNoteButton**

Replace the contents of `app/components/DeleteNoteButton.tsx`:

```tsx
"use client"

import { useRef, useState } from "react"
import { useActionState } from "react"
import { deleteNoteAction } from "@/app/actions"
import Button from "./Button"
import ConfirmModal from "@/app/components/ConfirmModal"

export default function DeleteNoteButton({ noteId }: { noteId: number }) {
  const [, action, pending] = useActionState(deleteNoteAction, null)
  const [modalOpen, setModalOpen] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  function handleConfirm() {
    setModalOpen(false)
    formRef.current?.requestSubmit()
  }

  return (
    <>
      <form ref={formRef} action={action}>
        <input type="hidden" name="noteId" value={noteId} />
        <Button
          type="button"
          disabled={pending}
          onClick={() => setModalOpen(true)}
        >
          {pending ? "Deleting..." : "Delete Note"}
        </Button>
      </form>
      <ConfirmModal
        open={modalOpen}
        title="Delete Note?"
        message="This note will be permanently deleted."
        onConfirm={handleConfirm}
        onCancel={() => setModalOpen(false)}
      />
    </>
  )
}
```

- [ ] **Step 5: Verify all 4 buttons compile**

Run: `& "C:\Program Files\nodejs\npm.cmd" run build`
Expected: Compiles with no errors.

Run: `& "C:\Program Files\nodejs\npm.cmd" run lint`
Expected: No errors.

---

## Summary of Changes

| File | Change |
|------|--------|
| `app/components/ConfirmModal.tsx` | New — reusable confirmation modal |
| `app/components/DeleteButton.tsx` | Add modal state + ConfirmModal |
| `app/components/DeleteRepoButton.tsx` | Add modal state + ConfirmModal + formRef |
| `app/components/DeleteTicketButton.tsx` | Add modal state + ConfirmModal + formRef |
| `app/components/DeleteNoteButton.tsx` | Add modal state + ConfirmModal + formRef |
