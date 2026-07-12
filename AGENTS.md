<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project

Personal issue tracker. Solo use, no auth. Next.js App Router + SQLite.

## Commands

```
npm run dev      # dev server, localhost:3000
npm run build    # production build (TypeScript + Turbopack)
npm run lint     # eslint
```

No test suite. No single-test runner.

## Architecture

```
lib/
  db.ts          # SQLite via better-sqlite3, singleton connection, sync functions
  constants.ts   # STATUS_LABELS, STATUS_COLORS, STATUSES

app/
  actions.ts     # Server Actions (createRepo, createTicket, updateStatus, addComment)
  page.tsx       # / — repo list
  repository/[id]/page.tsx         # /repository/:id — ticket list
  repository/[id]/ticket/[ticketId]/page.tsx  # /repository/:id/ticket/:ticketId — detail
  components/    # CreateRepoForm, CreateTicketForm, CommentForm, StatusDropdown
```

## Key facts

- **DB is sync.** `better-sqlite3` holds a global mutex. All `lib/db.ts` functions are synchronous — do NOT add async/await to them. Server Actions remain async (Next.js requirement), but DB calls inside are sync.
- **Singleton connection.** `getDb()` in `lib/db.ts` lazily initializes one connection. Schema runs once at first call. Do not create additional connections.
- **SQLite file:** `data.db` at project root. Gitignored. Auto-created on first DB call.
- **Route prefix:** `/repository/` (not `/repo/`). Directory is `app/repository/`.
- **Server Actions** in `app/actions.ts` catch `NEXT_REDIRECT` errors via `e.digest?.startsWith("NEXT_REDIRECT")`. Preserve this pattern when adding new actions.
- **Status values:** `pending` (orange), `in_progress` (blue), `completed` (green). Defined in `lib/constants.ts`, derived from `Ticket["status"]` type.
- **nanoid** for all IDs. Not crypto UUID.
- **No image upload.** Comments are text-only.
