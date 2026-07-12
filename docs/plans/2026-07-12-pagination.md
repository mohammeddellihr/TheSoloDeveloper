# Pagination Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Next/Previous pagination to all three list pages (Notes, Tickets, Repositories) with 12 items per page.

**Architecture:** Create a client component `Pagination` that renders Previous/Next buttons using URL search params. Each list page slices its items based on the `?page` param.

**Tech Stack:** Next.js App Router, React, Tailwind CSS

## Global Constraints

- No test suite — verification is `npm run build` + `npm run lint`
- Follow existing component patterns
- No comments in code unless asked
- Solo use, no auth

---

### Task 1: Create the Pagination component

**Files:**
- Create: `app/components/Pagination.tsx`

**Interfaces:**
- Consumes: nothing (standalone)
- Produces: `Pagination` component — `{ currentPage: number; totalPages: number }`

- [ ] **Step 1: Create the Pagination component**

Create `app/components/Pagination.tsx`:

```tsx
"use client"

import { useRouter, useSearchParams } from "next/navigation"

export default function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number
  totalPages: number
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  if (totalPages <= 1) return null

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", String(page))
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="flex items-center justify-center gap-2 pt-4">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 cursor-pointer"
      >
        Previous
      </button>
      <span className="text-sm text-gray-500 dark:text-gray-400">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 cursor-pointer"
      >
        Next
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: Compiles. Component renders nothing when totalPages <= 1.

Run: `npm run lint`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add app/components/Pagination.tsx
git commit -m "feat: add Pagination component"
```

---

### Task 2: Add pagination to Notes page

**Files:**
- Modify: `app/notes/page.tsx`

**Interfaces:**
- Consumes: `Pagination` from `@/app/components/Pagination`

- [ ] **Step 1: Add pagination to Notes page**

Modify `app/notes/page.tsx`. Add the import:

```tsx
import Pagination from "@/app/components/Pagination"
```

Change the searchParams type and add page logic. Replace:

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

with:

```tsx
const PAGE_SIZE = 12

export default async function NotesListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const { q, page } = await searchParams
  const term = (q ?? "").toLowerCase().trim()
  const allNotes = getNotes()
  const filtered = term
    ? allNotes.filter(
        (note) =>
          note.keywords.some((k) => k.toLowerCase().includes(term)) ||
          note.title.toLowerCase().includes(term) ||
          note.content.toLowerCase().includes(term),
      )
    : allNotes
  const currentPage = Math.max(1, Number(page) || 1)
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const notes = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
```

Add Pagination after the list. Replace:

```tsx
        </ul>
      )}
    </>
  )
}
```

with:

```tsx
        </ul>
      )}
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </>
  )
}
```

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: Compiles. Notes page shows pagination when more than 12 notes.

Run: `npm run lint`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add app/notes/page.tsx
git commit -m "feat: add pagination to Notes page"
```

---

### Task 3: Add pagination to Tickets page

**Files:**
- Modify: `app/tickets/page.tsx`

**Interfaces:**
- Consumes: `Pagination` from `@/app/components/Pagination`

- [ ] **Step 1: Add pagination to Tickets page**

Modify `app/tickets/page.tsx`. Add the import:

```tsx
import Pagination from "../components/Pagination"
```

Change the searchParams type and add page logic. Replace:

```tsx
export default async function TicketsPage({
  searchParams,
}: {
  searchParams: Promise<{ repository_id?: string; status?: string }>
}) {
  const params = await searchParams
  const repositories = getRepositories()
  const tickets = getAllTickets({
    repositoryId: params.repository_id || undefined,
    status: params.status || undefined,
  })
```

with:

```tsx
const PAGE_SIZE = 12

export default async function TicketsPage({
  searchParams,
}: {
  searchParams: Promise<{ repository_id?: string; status?: string; page?: string }>
}) {
  const params = await searchParams
  const repositories = getRepositories()
  const allTickets = getAllTickets({
    repositoryId: params.repository_id || undefined,
    status: params.status || undefined,
  })
  const currentPage = Math.max(1, Number(params.page) || 1)
  const totalPages = Math.ceil(allTickets.length / PAGE_SIZE)
  const tickets = allTickets.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
```

Add Pagination after the list. Replace:

```tsx
        </ul>
      )}
    </>
  )
}
```

with:

```tsx
        </ul>
      )}
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </>
  )
}
```

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: Compiles. Tickets page shows pagination when more than 12 tickets.

Run: `npm run lint`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add app/tickets/page.tsx
git commit -m "feat: add pagination to Tickets page"
```

---

### Task 4: Add pagination to Repositories page

**Files:**
- Modify: `app/repositories/page.tsx`

**Interfaces:**
- Consumes: `Pagination` from `@/app/components/Pagination`

- [ ] **Step 1: Add pagination to Repositories page**

Modify `app/repositories/page.tsx`. Add the import:

```tsx
import Pagination from "@/app/components/Pagination"
```

Add page logic. Replace:

```tsx
export default async function RepositoriesPage() {
  const repos = getRepositories()
```

with:

```tsx
const PAGE_SIZE = 12

export default async function RepositoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page } = await searchParams
  const allRepos = getRepositories()
  const currentPage = Math.max(1, Number(page) || 1)
  const totalPages = Math.ceil(allRepos.length / PAGE_SIZE)
  const repos = allRepos.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
```

Add Pagination after the list. Replace:

```tsx
        </ul>
      )}
    </>
  )
}
```

with:

```tsx
        </ul>
      )}
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </>
  )
}
```

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: Compiles. Repositories page shows pagination when more than 12 repos.

Run: `npm run lint`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add app/repositories/page.tsx
git commit -m "feat: add pagination to Repositories page"
```

---

## Summary of changes

| File | Change |
|------|--------|
| `app/components/Pagination.tsx` | New client component — Previous/Next buttons with URL search params |
| `app/notes/page.tsx` | Add page slicing + render Pagination |
| `app/tickets/page.tsx` | Add page slicing + render Pagination |
| `app/repositories/page.tsx` | Add page slicing + render Pagination |
