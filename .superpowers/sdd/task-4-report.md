# Task 4: Add pagination to Repositories page

## What I implemented

Added pagination to the repositories list page (`app/repositories/page.tsx`) with 12 items per page. Changes:

1. Imported `Pagination` from `@/app/components/Pagination`
2. Added `PAGE_SIZE = 12` constant
3. Updated component to accept `searchParams` (Next.js App Router pattern with `Promise<{ page?: string }>` type)
4. Computes `currentPage`, `totalPages`, and slices `repos` accordingly
5. Renders `<Pagination>` after the list

## Verification

- **`npm run build`**: Compiled successfully, no errors. `/repositories` correctly shows as a dynamic route.
- **`npm run lint`**: Clean, no warnings or errors.

## Files changed

- `app/repositories/page.tsx` — added import, pagination logic, and Pagination component

## Self-review findings

None. Implementation matches the task brief exactly. The Pagination component already handles the edge case where `totalPages <= 1` (returns null), so pagination won't show when there are 12 or fewer repos.
