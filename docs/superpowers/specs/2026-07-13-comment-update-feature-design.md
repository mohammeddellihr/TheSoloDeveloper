# Inline Comment Update Feature Design

## Overview

Add the ability to edit comments inline on the ticket detail page. Users click an edit icon, the comment text transforms into a textarea, and they can save or cancel the changes.

## Requirements

- Add update/edit icon button to each comment (alongside existing Delete and Copy buttons)
- Inline editing: clicking the icon transforms the comment text into an editable textarea
- Save button commits changes, Cancel button reverts
- Track when comments were updated with `updatedAt` field
- Follow existing patterns (server actions, component structure)

## Design

### Database Layer

**Schema change:**
```sql
ALTER TABLE comments ADD COLUMN updatedAt TEXT;
```

**Updated interface:**
```ts
export interface Comment {
  id: string
  text: string
  createdAt: string
  updatedAt: string | null
}
```

**New function in `lib/db.ts`:**
```ts
export function updateComment(commentId: string, text: string): Comment | null
```
- Updates the comment text and sets `updatedAt` to current ISO timestamp
- Returns the updated comment, or null if not found

### Server Action

**New action in `app/actions.ts`:**
```ts
export async function updateCommentAction(
  prevState: { error: string } | undefined,
  formData: FormData
)
```
- Reads: `repositoryId`, `ticketId`, `commentId`, `text` from FormData
- Validates text is not empty
- Calls `updateComment(commentId, text.trim())`
- Revalidates the ticket page path
- Follows same pattern as `addCommentAction` and `deleteCommentAction`

### UI Component

**New component: `app/components/UpdateCommentButton.tsx`**

Client component with two states:

1. **View mode (default):**
   - Pencil/edit icon button
   - Styling: `rounded p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer`
   - Icon: `h-4 w-4` SVG (pencil icon)
   - Click → enters edit mode

2. **Edit mode:**
   - Textarea pre-filled with current comment text
   - Textarea styling: matches CommentForm textarea (`w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100`)
   - Save button (primary variant) + Cancel button (secondary variant)
   - Save calls `updateCommentAction`, then exits edit mode
   - Cancel reverts to original text, exits edit mode

**Props:**
```ts
{
  repositoryId: string
  ticketId: string
  commentId: string
  initialText: string
}
```

### Ticket Detail Page Update

**File: `app/repository/[id]/ticket/[ticketId]/page.tsx`**

Replace static `<p>` with `UpdateCommentButton`:

```tsx
// Before:
<p className="text-sm leading-relaxed whitespace-pre-wrap">{comment.text}</p>

// After:
<UpdateCommentButton
  repositoryId={repo.id}
  ticketId={ticket.id}
  commentId={comment.id}
  initialText={comment.text}
/>
```

The button layout remains: `[Update] [Delete] [Copy]` in a flex row at the top-right of each comment card.

## Files to Modify

| File | Change |
|------|--------|
| `lib/db.ts` | Add `updatedAt` column to schema, update `Comment` interface, add `updateComment()` function |
| `app/actions.ts` | Add `updateCommentAction()` |
| `app/components/UpdateCommentButton.tsx` | New component (inline edit UI) |
| `app/repository/[id]/ticket/[ticketId]/page.tsx` | Replace `<p>` with `UpdateCommentButton` |

## Testing

- Visual verification: edit icon appears on each comment
- Click edit icon: textarea appears with current text
- Save: comment updates, exits edit mode
- Cancel: reverts to original text, exits edit mode
- Empty text validation: shows error
- Run `npm run lint` to verify no linting errors
