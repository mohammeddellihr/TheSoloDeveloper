# Spec: Flatten Routes

## Problem Statement

The current URL structure uses inconsistent singular/plural naming (`/note/`, `/repository/`, `/ticket/`) and tickets are nested under repositories (`/repository/[id]/ticket/[ticketId]`). This makes ticket URLs long andcoupled to the repository hierarchy, even though tickets are globally unique entities. The user wants a clean, consistent URL scheme where all resource routes use plural paths and tickets are first-class citizens accessible directly.

## Solution

Rename all singular resource directories to plural (`/note/` → `/notes/`, `/repository/` → `/repositories/`) and flatten ticket routes so tickets are accessed directly at `/tickets/[ticketId]` instead of being nested under `/repository/[id]/ticket/[ticketId]`. Tickets become top-level resources, while still maintaining their foreign key relationship to repositories in the database.

## User Stories

1. As a user, I want to access a note directly at `/notes/[id]` instead of `/note/[id]`, so that the URL scheme is consistent with the notes list at `/notes`
2. As a user, I want to update a note at `/notes/[id]/update` instead of `/note/[id]/update`, so that the URL scheme is consistent
3. As a user, I want to access a repository at `/repositories/[id]` instead of `/repository/[id]`, so that the URL scheme is consistent with the repositories list at `/repositories`
4. As a user, I want to update a repository at `/repositories/[id]/update` instead of `/repository/[id]/update`, so that the URL scheme is consistent
5. As a user, I want to create a repository at `/repositories/create` instead of `/repository/create`, so that the URL scheme is consistent
6. As a user, I want to access a ticket directly at `/tickets/[ticketId]` instead of `/repository/[id]/ticket/[ticketId]`, so that ticket URLs are shorter and don't require knowing the repository ID
7. As a user, I want to update a ticket at `/tickets/[ticketId]/update` instead of `/repository/[id]/ticket/[ticketId]/update`, so that ticket management is decoupled from repository navigation
8. As a user, I want to create a ticket at `/tickets/create` (already exists), so that ticket creation is a top-level action
9. As a user, I want all internal links and redirects to use the new URL scheme, so that I never encounter broken links or unexpected navigation
10. As a user, I want the breadcrumb navigation to reflect the new URL structure, so that navigation context is accurate
11. As a user, I want the ticket list page links to point to `/tickets/[ticketId]`, so that I can click through to tickets directly
12. As a user, I want the repository detail page ticket links to point to `/tickets/[ticketId]`, so that tickets are accessed consistently from within a repository view
13. As a user, I want the note list page links to point to `/notes/[id]`, so that note navigation is consistent
14. As a user, I want all server action redirects to use the new paths, so that form submissions navigate to the correct pages
15. As a user, I want cache revalidation to target the new paths, so that stale data is properly refreshed after mutations

## Implementation Decisions

### Route Renames

All singular resource directories are renamed to plural. The filesystem structure becomes:

- `app/notes/[id]/page.tsx` (moved from `app/note/[id]/`)
- `app/notes/[id]/update/page.tsx` (moved from `app/note/[id]/update/`)
- `app/repositories/[id]/page.tsx` (moved from `app/repository/[id]/`)
- `app/repositories/[id]/update/page.tsx` (moved from `app/repository/[id]/update/`)
- `app/repositories/[id]/TicketList.tsx` (moved from `app/repository/[id]/`)
- `app/repositories/create/page.tsx` (moved from `app/repository/create/`)
- `app/tickets/[ticketId]/page.tsx` (moved from `app/repository/[id]/ticket/[ticketId]/`)
- `app/tickets/[ticketId]/update/page.tsx` (moved from `app/repository/[id]/ticket/[ticketId]/update/`)

The old `app/repository/[id]/ticket/create/page.tsx` is deleted — superseded by the existing `app/tickets/create/page.tsx` which already handles `repository_id` as a query parameter.

### Ticket Route Flattening

Tickets are promoted from nested resources to top-level resources. The `[id]` param (repository ID) is removed from ticket route params. Ticket pages now receive only `{ ticketId: string }` from the URL.

### Database Function Changes

Ticket IDs are globally unique nanoids. The `repositoryId` constraint in `WHERE` clauses is redundant for single-ticket lookups. The following functions are modified to drop the `repositoryId` parameter:

- `getTicket(ticketId)` — was `getTicket(repositoryId, ticketId)`
- `updateTicket(ticketId, title, description, status)` — was `updateTicket(repositoryId, ticketId, ...)`
- `deleteTicket(ticketId)` — was `deleteTicket(repositoryId, ticketId)`
- `updateTicketStatus(ticketId, status)` — was `updateTicketStatus(repositoryId, ticketId, status)`
- `addComment(ticketId, text)` — was `addComment(repositoryId, ticketId, text)`

The `WHERE id = ? AND repositoryId = ?` clauses become `WHERE id = ?`. The `repositoryId` is still available on the returned `Ticket` object for any page that needs to link back to the parent repository.

### Server Action Changes

All `redirect()` and `revalidatePath()` calls in `app/actions.ts` are updated to use the new paths. This is the single seam where all mutation flows route through — any redirect after a create/update/delete action passes through this module.

### Component Route Strings

All `Link href` values in pages and components are updated to match the new URL scheme. The highest seam for this is the page-level components — each page owns its own links. The `TicketList` component (co-located with the repository page) also has a link that changes.

## Testing Decisions

- No test suite exists in this project — verification is done via `npm run build` (TypeScript + Turbopack) and `npm run lint` (ESLint)
- The build command catches type errors from mismatched function signatures (e.g., if `getTicket` signature changes but a caller isn't updated)
- The lint command catches any syntax or style issues introduced by the changes
- Manual verification: navigate to each renamed route to confirm pages load correctly

## Out of Scope

- Adding a test suite
- Changing the data model (tickets remain tied to repositories via foreign key)
- Changing the ticket creation flow (already works via `/tickets/create?repository_id=...`)
- Modifying the `TicketList` component's filtering behavior
- Adding redirect rules from old URLs to new URLs (this is a solo-use app, no SEO concerns)

## Further Notes

This is a solo-use personal issue tracker with no auth. The route changes are safe to make without migration or backward compatibility concerns. The empty `app/note/` and `app/repository/` directories should be deleted after all files are moved out of them.
