# Pagination Design

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:writing-plans to create the implementation plan for this spec.

**Goal:** Add Next/Previous pagination to all three list pages (Notes, Tickets, Repositories) with 12 items per page.

**Architecture:** Create a client component `Pagination` that renders Previous/Next buttons using URL search params. Each list page slices its items based on the `?page` param.

**Tech Stack:** Next.js App Router, React, Tailwind CSS

---

## Requirements

1. All three list pages (Notes, Tickets, Repositories) have pagination
2. 12 items per page
3. URL search param `?page=N` tracks the current page (defaults to 1)
4. Previous button disabled on page 1, Next button disabled on last page
5. Buttons are centered below the list
6. Clicking a button navigates to the new page via URL change

## Components

### Pagination

- **File:** `app/components/Pagination.tsx`
- **Type:** Client component (`"use client"`)
- **Props:** `{ currentPage: number; totalPages: number }`
- **Renders:** Two buttons (Previous, Next) centered horizontally
- **Behavior:** Uses `useRouter` and `useSearchParams` to navigate to `?page=N`
- **Styling:** Previous/Next buttons consistent with project's Button component style

### List Page Integration

Each list page (`app/notes/page.tsx`, `app/tickets/page.tsx`, `app/repositories/page.tsx`):
- Reads `page` from searchParams (defaults to 1)
- Calculates `totalPages = Math.ceil(items.length / 12)`
- Slices items: `items.slice((page - 1) * 12, page * 12)`
- Renders `<Pagination currentPage={page} totalPages={totalPages} />` below the list

## Files

| File | Change |
|------|--------|
| `app/components/Pagination.tsx` | New client component |
| `app/notes/page.tsx` | Add pagination logic + render Pagination |
| `app/tickets/page.tsx` | Add pagination logic + render Pagination |
| `app/repositories/page.tsx` | Add pagination logic + render Pagination |

## Edge Cases

- Empty list: pagination not rendered
- Page param out of range (e.g., `?page=999`): clamp to valid range
- Page param less than 1: default to page 1

## Out of Scope

- Item count display (e.g., "Showing 1-12 of 45")
- Page number indicators
- Infinite scroll
