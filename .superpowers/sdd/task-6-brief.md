# Task 6: Fix Remaining Visual Inconsistencies

**Files:**
- Modify: `app/tickets/page.tsx`
- Modify: `app/repository/[id]/ticket/[ticketId]/page.tsx`
- Modify: `app/components/StatusDropdown.tsx`
- Modify: `app/components/NoteSearch.tsx`

- [ ] **Step 1: Fix tickets/page.tsx imports to use @/ alias**

In `app/tickets/page.tsx`, change all relative imports to use the `@/` alias:

Current (lines 3-8):
```tsx
import Header from "../components/Header"
import Card from "../components/Card"
import Badge from "../components/Badge"
import Pagination from "../components/Pagination"
```

New:
```tsx
import Header from "@/app/components/Header"
import Card from "@/app/components/Card"
import Badge from "@/app/components/Badge"
import Pagination from "@/app/components/Pagination"
```

Also change the db import if it uses relative path:
```tsx
import { getTickets } from "@/lib/db"
```

- [ ] **Step 2: Fix comment section gap from gap-3 to gap-2**

In `app/repository/[id]/ticket/[ticketId]/page.tsx`, find `<div className="flex flex-col gap-3">` and change `gap-3` to `gap-2`:

```tsx
<div className="flex flex-col gap-2">
```

- [ ] **Step 3: Add disabled:cursor-not-allowed to StatusDropdown**

In `app/components/StatusDropdown.tsx`, find the `<select>` element and add `disabled:cursor-not-allowed` to its className:

```tsx
className="rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-black dark:focus:border-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
```

- [ ] **Step 4: Fix NoteSearch input width**

In `app/components/NoteSearch.tsx`, find the `<input>` element and change `w-full` to `w-64`:

```tsx
className="w-64 rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
```

- [ ] **Step 5: Verify**

Run: `& "C:\Program Files\nodejs\npm.cmd" run build`
Expected: Compiles.

Run: `& "C:\Program Files\nodejs\npm.cmd" run lint`
Expected: No errors.
