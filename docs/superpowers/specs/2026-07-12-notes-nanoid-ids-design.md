# Design: Notes Nanoid IDs

Change notes from auto-increment integer IDs to nanoid-based string IDs, matching repos/tickets/comments.

## Changes

### Schema (`lib/db.ts`)

- `notes.id`: `INTEGER PRIMARY KEY AUTOINCREMENT` → `TEXT PRIMARY KEY`
- No migration needed — existing numeric IDs stored as TEXT, SQLite handles both

### Note interface (`lib/db.ts`)

- `id: number` → `id: string`

### DB functions (`lib/db.ts`)

| Function | Change |
|----------|--------|
| `createNote()` | Generate `nanoid()` id, insert explicitly, return `getNote(id)` |
| `getNote()` | Parameter type `number` → `string` |
| `updateNote()` | Parameter type `number` → `string` |
| `deleteNote()` | Parameter type `number` → `string` |

### Actions (`app/actions.ts`)

- `updateNoteAction`: Remove `Number(noteId)` — use string directly
- `deleteNoteAction`: Remove `Number(noteId)` — use string directly

### Pages

- `app/note/[id]/page.tsx`: Route param is already string (Next.js dynamic params)
- `app/note/[id]/update/page.tsx`: Same

## Files

1. `lib/db.ts`
2. `app/actions.ts`
3. `app/note/[id]/page.tsx` (verify param usage)
4. `app/note/[id]/update/page.tsx` (verify param usage)

## Verification

- `npm run build` passes
- `npm run lint` passes
- Create/edit/delete notes work with new IDs
