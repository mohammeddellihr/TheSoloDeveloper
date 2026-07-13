# Plan: Flatten Routes

Rename singular resource directories to plural, flatten ticket routes so tickets are accessed directly at `/tickets/[ticketId]` instead of nested under repositories.

## Route Changes

| Old Route | New Route |
|-----------|-----------|
| `/note/[id]` | `/notes/[id]` |
| `/note/[id]/update` | `/notes/[id]/update` |
| `/repository/[id]` | `/repositories/[id]` |
| `/repository/[id]/update` | `/repositories/[id]/update` |
| `/repository/create` | `/repositories/create` |
| `/repository/[id]/ticket/[ticketId]` | `/tickets/[ticketId]` |
| `/repository/[id]/ticket/[ticketId]/update` | `/tickets/[ticketId]/update` |
| `/repository/[id]/ticket/create` | DELETE (already exists at `/tickets/create`) |

## DB Change

Add `getTicketById(ticketId: string)` in `lib/db.ts` — looks up a ticket by ID alone (no repo ID needed). The flattened ticket pages only receive `ticketId` from params; the repo ID comes from `ticket.repositoryId`.

Also add `deleteTicketById(ticketId)` and `updateTicketStatusById(ticketId, status)` and `updateTicketById(ticketId, ...)` variants that don't require repo ID — or modify existing functions to drop the repo ID constraint. The `WHERE id = ? AND repositoryId = ?` clauses become `WHERE id = ?` since ticket IDs are globally unique (nanoid).

## Files to Move

| Current | New |
|---------|-----|
| `app/note/[id]/page.tsx` | `app/notes/[id]/page.tsx` |
| `app/note/[id]/update/page.tsx` | `app/notes/[id]/update/page.tsx` |
| `app/repository/create/page.tsx` | `app/repositories/create/page.tsx` |
| `app/repository/[id]/page.tsx` | `app/repositories/[id]/page.tsx` |
| `app/repository/[id]/update/page.tsx` | `app/repositories/[id]/update/page.tsx` |
| `app/repository/[id]/TicketList.tsx` | `app/repositories/[id]/TicketList.tsx` |
| `app/repository/[id]/ticket/[ticketId]/page.tsx` | `app/tickets/[ticketId]/page.tsx` |
| `app/repository/[id]/ticket/[ticketId]/update/page.tsx` | `app/tickets/[ticketId]/update/page.tsx` |

Delete after moves:
- `app/note/` (empty)
- `app/repository/` (empty)

## Files to Edit (string replacements)

### `lib/db.ts`
- Add `getTicketById(ticketId)` function (no repo ID param)
- Modify `getTicket`, `updateTicket`, `deleteTicket`, `updateTicketStatus`, `addComment` to drop the `repositoryId` constraint (ticket IDs are unique nanoids)

### `app/actions.ts` — 9 redirect/revalidatePath changes
- Line 23: `/repository/${repositoryId}/ticket/${ticket.id}` → `/tickets/${ticket.id}`
- Line 46: `/repository/${repositoryId}/ticket/${ticketId}` → `/tickets/${ticketId}`
- Line 63: `/repository/${repositoryId}/ticket/${ticketId}` → `/tickets/${ticketId}`
- Line 83: `/repository/${repositoryId}/ticket/${ticketId}` → `/tickets/${ticketId}`
- Line 110: `/repository/${repo.id}` → `/repositories/${repo.id}`
- Line 130: `/repository/${repositoryId}` → `/repositories/${repositoryId}`
- Line 171: `/repository/${repositoryId}/ticket/${ticketId}` → `/tickets/${ticketId}`
- Line 188: `/repository/${repositoryId}` → `/repositories/${repositoryId}`
- Line 210: `/note/${note.id}` → `/notes/${note.id}`
- Line 234: `/note/${note.id}` → `/notes/${note.id}`
- Line 268: `/repository/${repositoryId}/ticket/${ticketId}` → `/tickets/${ticketId}`

### `app/notes/page.tsx` line 57
- `/note/${note.id}` → `/notes/${note.id}`

### `app/repositories/page.tsx` lines 29, 45
- `/repository/create` → `/repositories/create`
- `/repository/${repo.id}` → `/repositories/${repo.id}`

### `app/tickets/page.tsx` line 52
- `/repository/${ticket.repositoryId}/ticket/${ticket.id}` → `/tickets/${ticket.id}`

### `app/repositories/[id]/page.tsx` line 25 (after move)
- `/repository/${repo.id}/update` → `/repositories/${repo.id}/update`

### `app/repositories/[id]/TicketList.tsx` line 53 (after move)
- `/repository/${repositoryId}/ticket/${ticket.id}` → `/tickets/${ticket.id}`

### `app/notes/[id]/page.tsx` line 21 (after move)
- `/note/${note.id}/update` → `/notes/${note.id}/update`

### `app/notes/[id]/update/page.tsx` line 24 (after move)
- `/note/${note.id}` → `/notes/${note.id}`

### `app/tickets/[ticketId]/page.tsx` (after move from nested ticket page)
- Change params from `{ id: string; ticketId: string }` to `{ ticketId: string }`
- Use `getTicketById(ticketId)` instead of `getTicket(id, ticketId)`
- Update link: `/repository/${repo.id}/ticket/${ticket.id}/update` → `/tickets/${ticket.id}/update`

### `app/tickets/[ticketId]/update/page.tsx` (after move from nested ticket update)
- Change params from `{ id: string; ticketId: string }` to `{ ticketId: string }`
- Use `getTicketById(ticketId)` instead of `getTicket(id, ticketId)`

## Execution Order

1. Update `lib/db.ts` — add `getTicketById`, drop repo ID constraint from other functions
2. Move files (create new dirs, write files, delete old dirs)
3. Update route strings in moved files and existing files
4. Update `app/actions.ts`
5. Delete `app/repository/[id]/ticket/create/page.tsx` (superseded by existing `app/tickets/create/page.tsx`)
6. Delete empty `app/note/` and `app/repository/` directories
7. Run `npm run build` to verify

## Verification

- `npm run build` — TypeScript + Turbopack build must pass
- `npm run lint` — no new lint errors
