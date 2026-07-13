# Delete Comment Design

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:writing-plans to create the implementation plan for this spec.

**Goal:** Add a delete button to each comment on the ticket detail page, allowing instant deletion with a single click.

**Architecture:** Add a `deleteComment` DB function, a `deleteCommentAction` server action, and a `DeleteButton` client component that calls the action via `fetch` and revalidates the page.

**Tech Stack:** Next.js App Router, React, Tailwind CSS, Server Actions

---

## Requirements

1. Each comment card has a trash icon button in the top-right, next to the copy button
2. Clicking the icon instantly deletes the comment (no confirmation dialog)
3. After deletion, the page revalidates and the comment disappears
4. The delete action uses a server action with `revalidatePath`

## Components

### DB Function

- **File:** `lib/db.ts`
- **Function:** `deleteComment(commentId: string): boolean`
- **SQL:** `DELETE FROM comments WHERE id = ?`
- **Returns:** `true` if a row was deleted, `false` otherwise

### Server Action

- **File:** `app/actions.ts`
- **Function:** `deleteCommentAction(repositoryId: string, ticketId: string, commentId: string)`
- **Calls:** `deleteComment(commentId)`
- **Revalidates:** `/repository/${repositoryId}/ticket/${ticketId}`

### DeleteButton Component

- **File:** `app/components/DeleteButton.tsx`
- **Type:** Client component (`"use client"`)
- **Props:** `{ repositoryId: string; ticketId: string; commentId: string }`
- **Renders:** A small trash icon button
- **Behavior:** On click, calls `deleteCommentAction` via `fetch`, then `router.refresh()`
- **Styling:** Same style as `CopyContentButton` — small, subtle, gray icon

### Ticket Page Integration

- **File:** `app/repository/[id]/ticket/[ticketId]/page.tsx`
- **Change:** Add `DeleteButton` next to `CopyContentButton` in each comment card

## Files

| File | Change |
|------|--------|
| `lib/db.ts` | Add `deleteComment` function |
| `app/actions.ts` | Add `deleteCommentAction` server action |
| `app/components/DeleteButton.tsx` | New client component |
| `app/repository/[id]/ticket/[ticketId]/page.tsx` | Add DeleteButton in comment cards |

## Edge Cases

- Comment ID doesn't exist: `deleteComment` returns false, no error thrown
- Multiple rapid clicks: button should handle gracefully (no duplicate deletes)

## Out of Scope

- Confirmation dialog before delete
- Undo functionality
- Soft delete (trash/recycle bin)
