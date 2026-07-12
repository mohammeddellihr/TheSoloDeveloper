# Task 2: Add pagination to Notes page

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
