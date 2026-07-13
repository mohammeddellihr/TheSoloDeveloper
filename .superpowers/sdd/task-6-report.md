# Task 6: Fix Remaining Visual Inconsistencies

## What I Implemented

1. **tickets/page.tsx** — Changed all relative component imports (`../components/...`) to `@/app/components/...` alias imports.
2. **ticket/[ticketId]/page.tsx** — Changed comment section gap from `gap-3` to `gap-2`.
3. **StatusDropdown.tsx** — Added `disabled:cursor-not-allowed` class to the `<select>` element.
4. **NoteSearch.tsx** — Changed input width from `w-full` to `w-64`.

## Verification

- **npm run build**: Compiled successfully, all routes generated.
- **npm run lint**: 0 errors (3 pre-existing warnings in unrelated files: unused `Button` imports in DeleteNoteButton, DeleteRepoButton, DeleteTicketButton).

## Files Changed

- `app/tickets/page.tsx` (lines 3-8: import paths)
- `app/repository/[id]/ticket/[ticketId]/page.tsx` (line 56: gap-3 → gap-2)
- `app/components/StatusDropdown.tsx` (line 29: added disabled:cursor-not-allowed)
- `app/components/NoteSearch.tsx` (line 24: w-full → w-64)

## Issues

None. All 4 changes applied cleanly. Build and lint pass.
