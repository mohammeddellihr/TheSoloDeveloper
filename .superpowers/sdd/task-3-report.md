# Task 3: Fix Header and Breadcrumb Inconsistencies

## What I Implemented

All 4 steps from the task brief:

1. **Note detail page** (`app/note/[id]/page.tsx:18`): Changed Header title from `note.title` to `"Note"` (Card `<h1>` still shows `note.title`)
2. **Note update page** (`app/note/[id]/update/page.tsx:21`): Changed Header title from template literal to `"Update Note"`
3. **Ticket detail page** (`app/repository/[id]/ticket/[ticketId]/page.tsx:26`): Replaced `"Tickets"` breadcrumb with `Repositories` > `repo.name` hierarchy
4. **Ticket create page** (`app/repository/[id]/ticket/create/page.tsx:20`): Replaced `"Tickets"` breadcrumb with `Repositories` > `repo.name` hierarchy

## Verification

- **Build**: Compiled successfully, no TypeScript errors
- **Lint**: 0 errors (4 pre-existing warnings in unrelated files)

## Files Changed

- `app/note/[id]/page.tsx` — Header title
- `app/note/[id]/update/page.tsx` — Header title
- `app/repository/[id]/ticket/[ticketId]/page.tsx` — Breadcrumbs
- `app/repository/[id]/ticket/create/page.tsx` — Breadcrumbs

## Issues

None.
