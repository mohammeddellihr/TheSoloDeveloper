# Delete Confirmation Modal

## Goal

Add a confirmation modal to every delete button in the app. No delete should fire without the user explicitly confirming.

## Scope

4 delete buttons affected:

| Button | Entity | Placement |
|--------|--------|-----------|
| `DeleteButton` | Comment | Ticket detail (inline icon) |
| `DeleteRepoButton` | Repository | Update repo page |
| `DeleteTicketButton` | Ticket | Update ticket page |
| `DeleteNoteButton` | Note | Update note page |

## Approach

Create a reusable `ConfirmModal` client component. Each delete button manages its own modal state (`useState`). No shared hook — each button's logic is different enough that abstraction would add complexity without value.

## ConfirmModal Component

**File:** `app/components/ConfirmModal.tsx`

**Interface:**

```tsx
interface ConfirmModalProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string   // defaults to "Delete"
  onConfirm: () => void
  onCancel: () => void
}
```

**Behavior:**
- When `open` is false, renders nothing (early return)
- Dark semi-transparent overlay (`bg-black/50`) covers viewport
- Centered card: white bg light mode, dark gray bg dark mode
- Title (bold), message text, two buttons side by side
- Neutral "Cancel" button + red "Delete" button
- Clicking overlay calls `onCancel`
- Pressing Escape calls `onCancel`
- Clicking Delete calls `onConfirm`
- Uses `useEffect` to register/remove keydown listener for Escape

**Styling:**
- Overlay: fixed inset-0, z-50, flex items-center justify-center, bg-black/50
- Card: rounded-lg shadow-xl p-6, max-w-md w-full
- Title: text-lg font-bold
- Message: text-sm text-gray-600 dark:text-gray-400, mt-2
- Buttons: flex justify-end gap-3, mt-6
  - Cancel: existing Button component (neutral)
  - Delete: red background (`bg-red-500 hover:bg-red-600 text-white`), rounded-md px-4 py-2 text-sm font-medium

## Integration into Delete Buttons

### DeleteButton (comments)

**File:** `app/components/DeleteButton.tsx`

- Add `useState<boolean>` for modal open state
- Click handler opens modal instead of executing delete
- Modal `onConfirm`: closes modal, executes existing delete logic (build FormData, call `deleteCommentAction`, refresh)
- Modal `onCancel`: closes modal

### DeleteRepoButton

**File:** `app/components/DeleteRepoButton.tsx`

- Add `useState<boolean>` for modal open state
- Button click opens modal (prevent default form submit)
- Modal `onConfirm`: closes modal, programmatically submits the form via `formRef.current.requestSubmit()`
- Modal `onCancel`: closes modal
- Add `formRef = useRef<HTMLFormElement>(null)` for programmatic submit

### DeleteTicketButton

**File:** `app/components/DeleteTicketButton.tsx`

Same pattern as DeleteRepoButton.

### DeleteNoteButton

**File:** `app/components/DeleteNoteButton.tsx`

Same pattern as DeleteRepoButton.

## Cascade Messages

| Button | Title | Message |
|--------|-------|---------|
| DeleteButton | "Delete Comment?" | "This comment will be permanently deleted." |
| DeleteRepoButton | "Delete Repository?" | "This will also delete all its tickets and comments. This action cannot be undone." |
| DeleteTicketButton | "Delete Ticket?" | "This will also delete all its comments. This action cannot be undone." |
| DeleteNoteButton | "Delete Note?" | "This note will be permanently deleted." |

## Files Changed

| File | Change |
|------|--------|
| `app/components/ConfirmModal.tsx` | New — reusable modal component |
| `app/components/DeleteButton.tsx` | Add modal state + integrate ConfirmModal |
| `app/components/DeleteRepoButton.tsx` | Add modal state + integrate ConfirmModal |
| `app/components/DeleteTicketButton.tsx` | Add modal state + integrate ConfirmModal |
| `app/components/DeleteNoteButton.tsx` | Add modal state + integrate ConfirmModal |

## Verification

- `npm run build` — compiles with no errors
- `npm run lint` — no lint errors
- Manual: clicking any delete icon/button opens modal, Cancel closes without deleting, Delete confirms and executes
