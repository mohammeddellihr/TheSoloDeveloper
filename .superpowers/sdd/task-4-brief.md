# Task 4: Add pagination to Repositories page

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
