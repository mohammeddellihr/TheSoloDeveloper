# Task 3: Add pagination to Tickets page

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
