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
  utils.ts       # formatDate helper

app/
  actions.ts     # Server Actions (createRepo, createTicket, updateStatus, addComment, createNote, updateNote, deleteNote)
  page.tsx       # / — dashboard with stats
  components/    # Button, Card, Badge, Header, forms (Create*, Update*, Delete*), CommentForm, StatusDropdown, TicketFilters

  repositories/page.tsx              # /repositories — repo list
  repository/create/page.tsx         # /repository/create
  repository/[id]/page.tsx           # /repository/:id — ticket list
  repository/[id]/update/page.tsx    # /repository/:id/update
  repository/[id]/ticket/create/page.tsx
  repository/[id]/ticket/[ticketId]/page.tsx
  repository/[id]/ticket/[ticketId]/update/page.tsx

  tickets/page.tsx                   # /tickets — all tickets (filterable)
  notes/page.tsx                     # /notes — note list
  notes/create/page.tsx              # /notes/create
  note/[id]/page.tsx                 # /note/:id
  note/[id]/update/page.tsx          # /note/:id/update
```

## Key facts

- **DB is sync.** `better-sqlite3` holds a global mutex. All `lib/db.ts` functions are synchronous — do NOT add async/await to them. Server Actions remain async (Next.js requirement), but DB calls inside are sync.
- **Singleton connection.** `getDb()` in `lib/db.ts` lazily initializes one connection. Schema runs once at first call. Do not create additional connections.
- **SQLite file:** `data.db` at project root. Gitignored. Auto-created on first DB call.
- **Route prefix:** `/repository/` (not `/repo/`). Directory is `app/repository/`.
- **Server Actions** in `app/actions.ts` catch `NEXT_REDIRECT` errors via `e.digest?.startsWith("NEXT_REDIRECT")`. Preserve this pattern when adding new actions.
- **Status values:** `pending` (orange), `in_progress` (blue), `completed` (green). Defined in `lib/constants.ts`, derived from `Ticket["status"]` type.
- **nanoid** for repo/ticket/comment IDs. Notes use `INTEGER PRIMARY KEY AUTOINCREMENT`.
- **Notes keywords** stored as JSON array string in SQLite, parsed to `string[]` in `getNotes()`/`getNote()`.
- **No image upload.** Comments are text-only.
- **Form pattern:** Forms are bare `<form>` components (no Card wrapper). Pages wrap them in `<Card>`. Inputs use full dark mode classes. No Cancel buttons — only submit.
