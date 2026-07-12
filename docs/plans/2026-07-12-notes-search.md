# Notes Search Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a keyword/title/content search box to the Notes list page that autofocuses on load and filters with priority keywords → title → content.

**Architecture:** A new client component `NoteSearch` writes the query to the URL (`?q=`), mirroring `TicketFilters`. The `notes/page.tsx` server component reads `searchParams.q` and filters the in-memory notes array with the priority order. No DB change needed — dataset is tiny (personal use) and the priority logic is clearer in JS than SQL.

**Tech Stack:** Next.js App Router, React, Tailwind CSS

---

## Context

- `app/notes/page.tsx` is currently a server component with no `searchParams`. It calls `getNotes()` (sync, see `lib/db.ts:234`) and renders a list.
- `app/components/TicketFilters.tsx` is the existing reference pattern: a `"use client"` component using `useRouter` + `useSearchParams` to push `?key=value` into the URL.
- The Tickets page (`app/tickets/page.tsx`) reads `searchParams` and passes them to a filtered DB query. We mirror that URL-driven approach but filter in JS for the priority order.
- `Header` already takes an `actions` slot (used for the "Create Note" button). The search bar will be rendered as a full-width element below the `Header`.
- This repo has **no test suite** (see AGENTS.md). Verification is `npm run build` + `npm run lint`, plus a manual browser check.

## Search priority (filter rule)

A note is shown if **any** of these match the lowercased query (checked in this order):
1. Any keyword contains the query
2. Title contains the query
3. Content contains the query

Empty query → show all.

---

### Task 1: Create the NoteSearch client component

**Files:**
- Create: `app/components/NoteSearch.tsx`

**Step 1: Write the component**

```tsx
"use client"

import { useRouter, useSearchParams } from "next/navigation"

export default function NoteSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const q = searchParams.get("q") ?? ""

  function update(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set("q", value)
    else params.delete("q")
    router.push(`/notes?${params.toString()}`)
  }

  return (
    <input
      type="search"
      autoFocus
      value={q}
      onChange={(e) => update(e.target.value)}
      placeholder="Search notes..."
      className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
    />
  )
}
```

**Step 2: Verify it compiles**

Run: `npm run build`
Expected: Compiles with no type errors.

**Step 3: Commit**

```bash
git add app/components/NoteSearch.tsx
git commit -m "feat: add NoteSearch client component with autofocus"
```

---

### Task 2: Wire search into the Notes list page

**Files:**
- Modify: `app/notes/page.tsx`

**Step 1: Make the page accept `searchParams` and filter notes**

Replace the top of the component (lines 7-8) so it is `async`, reads `searchParams`, and filters:

```tsx
export default async function NotesListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const term = (q ?? "").toLowerCase().trim()
  const allNotes = getNotes()
  const notes = term
    ? allNotes.filter(
        (note) =>
          note.keywords.some((k) => k.toLowerCase().includes(term)) ||
          note.title.toLowerCase().includes(term) ||
          note.content.toLowerCase().includes(term),
      )
    : allNotes
```

**Step 2: Render the search bar below the Header**

Insert `<NoteSearch />` right after the closing `</Header>` (after line 20), wrapped in a `Card` so it matches the visual rhythm:

```tsx
      </Header>

      <Card>
        <NoteSearch />
      </Card>
```

Add the import at the top (near line 5):
```tsx
import NoteSearch from "@/app/components/NoteSearch"
```

**Step 3: Use the filtered `notes` in the list**

The list currently maps over `notes` (the variable returned by `getNotes()`). Because we now reassign `notes` to the filtered array in Step 1, the existing `notes.map(...)` block (lines 27-57) already uses the correct variable — no further change needed there. Confirm the variable name matches.

**Step 4: Verify**

Run: `npm run build`
Expected: Compiles, no type errors.

Run: `npm run lint`
Expected: No errors.

**Step 5: Commit**

```bash
git add app/notes/page.tsx
git commit -m "feat: filter notes list by search query with keyword/title/content priority"
```

---

### Task 3: Manual verification

**Step 1: Start dev server**

Run: `npm run dev`
Open: `http://localhost:3000/notes`

**Step 2: Check behaviors**
- Search input is focused immediately on page load.
- Typing a keyword filters notes that contain that keyword.
- Typing a word from a title filters by title.
- Typing a word from content filters by content.
- Clearing the input shows all notes again.
- The URL shows `?q=...` and reload preserves the filter.

---

## Summary of changes

| File | Change |
|------|--------|
| `app/components/NoteSearch.tsx` | New client component: autofocus search input writing `?q=` to URL |
| `app/notes/page.tsx` | Read `searchParams.q`, filter notes (keywords → title → content), render `NoteSearch` |
