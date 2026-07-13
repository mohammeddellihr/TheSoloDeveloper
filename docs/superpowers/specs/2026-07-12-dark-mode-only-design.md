# Dark Mode Only Design

## Goal

Make the app dark-mode-only. Remove all `dark:` prefixed classes and light mode styles. The app is always dark.

## Scope

28 files with ~94 `dark:` class usages, plus `globals.css` for CSS variables.

## Approach

Manual transformation: for each file, replace every `dark:X` class with just `X`, and remove the light-mode counterpart. Update CSS variables to dark-only values.

## CSS Variables (globals.css)

Replace the light/dark CSS variables with dark-only values using Material Design Gray:

```css
:root {
  --background: #212121;  /* Gray 900 */
  --foreground: #FAFAFA;  /* Gray 50 */
}
```

Remove the `@media (prefers-color-scheme: dark)` block entirely.

## Transformation Rules

For every file, apply these rules:

| Before | After |
|--------|-------|
| `bg-gray-50 dark:bg-gray-900` | `bg-gray-900` |
| `text-gray-900 dark:text-gray-100` | `text-gray-100` |
| `border-gray-200 dark:border-gray-800` | `border-gray-800` |
| `bg-white dark:bg-black` | `bg-black` |
| `text-black dark:text-white` | `text-white` |
| `hover:bg-gray-800 dark:hover:bg-gray-700` | `hover:bg-gray-700` |
| `focus:border-black dark:focus:border-white` | `focus:border-white` |
| `focus-visible:outline-black dark:focus-visible:outline-white` | `focus-visible:outline-white` |

**Rule:** Keep the `dark:` value, remove the light counterpart and the `dark:` prefix.

**Edge cases:**
- `dark:bg-blue-900/30` (no light counterpart) → `bg-blue-900/30`
- `dark:text-gray-400` (no light counterpart) → `text-gray-400`

## Files Changed

| File | Change |
|------|--------|
| `app/globals.css` | Update CSS variables, remove `prefers-color-scheme` block |
| `lib/constants.ts` | Remove `dark:` from status colors |
| `app/page.tsx` | Remove `dark:` classes |
| `app/layout.tsx` | Remove `dark:` classes |
| `app/components/Button.tsx` | Remove `dark:` classes |
| `app/components/Card.tsx` | Remove `dark:` classes |
| `app/components/CommentForm.tsx` | Remove `dark:` classes |
| `app/components/ConfirmModal.tsx` | Remove `dark:` classes |
| `app/components/CopyContentButton.tsx` | Remove `dark:` classes |
| `app/components/CreateNoteForm.tsx` | Remove `dark:` classes |
| `app/components/CreateRepoForm.tsx` | Remove `dark:` classes |
| `app/components/CreateTicketForm.tsx` | Remove `dark:` classes |
| `app/components/DeleteButton.tsx` | Remove `dark:` classes |
| `app/components/ExternalLinkButton.tsx` | Remove `dark:` classes |
| `app/components/Header.tsx` | Remove `dark:` classes |
| `app/components/NoteSearch.tsx` | Remove `dark:` classes |
| `app/components/Pagination.tsx` | Remove `dark:` classes |
| `app/components/SourceBadge.tsx` | Remove `dark:` classes |
| `app/components/StatusDropdown.tsx` | Remove `dark:` classes |
| `app/components/TicketFilters.tsx` | Remove `dark:` classes |
| `app/components/UpdateNoteForm.tsx` | Remove `dark:` classes |
| `app/components/UpdateRepoForm.tsx` | Remove `dark:` classes |
| `app/components/UpdateTicketForm.tsx` | Remove `dark:` classes |
| `app/repositories/page.tsx` | Remove `dark:` classes |
| `app/repository/create/page.tsx` | Remove `dark:` classes |
| `app/repository/[id]/page.tsx` | Remove `dark:` classes |
| `app/repository/[id]/TicketList.tsx` | Remove `dark:` classes |
| `app/repository/[id]/ticket/create/page.tsx` | Remove `dark:` classes |
| `app/repository/[id]/ticket/[ticketId]/page.tsx` | Remove `dark:` classes |
| `app/tickets/page.tsx` | Remove `dark:` classes |
| `app/tickets/create/page.tsx` | Remove `dark:` classes |
| `app/notes/page.tsx` | Remove `dark:` classes |
| `app/notes/create/page.tsx` | Remove `dark:` classes |
| `app/note/[id]/page.tsx` | Remove `dark:` classes |

## Verification

- `npm run build` — compiles with no errors
- `npm run lint` — no lint errors
- App renders in dark mode only, no light mode styles remain
