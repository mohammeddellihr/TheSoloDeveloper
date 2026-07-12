# Task 1: Create the Pagination component

## What I Implemented

Created `app/components/Pagination.tsx` — a client component with Previous/Next buttons that use URL search params (`?page=N`) to track the current page. Returns `null` when `totalPages <= 1`.

## Verification

- `npm run build` — compiled successfully, no TypeScript errors
- `npm run lint` — passed with no errors

## Files Changed

- **Created:** `app/components/Pagination.tsx`

## Self-Review

- Component matches the task spec exactly
- Client component with `"use client"` directive
- Uses `useRouter` and `useSearchParams` from `next/navigation`
- Button styles include dark mode classes consistent with the rest of the codebase
- Proper disabled states on Previous (page 1) and Next (last page)
- Hidden when `totalPages <= 1`

No concerns.
