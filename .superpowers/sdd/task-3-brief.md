# Task 3: Fix Header and Breadcrumb Inconsistencies

**Files:**
- Modify: `app/note/[id]/page.tsx`
- Modify: `app/note/[id]/update/page.tsx`
- Modify: `app/repository/[id]/ticket/[ticketId]/page.tsx`
- Modify: `app/repository/[id]/ticket/create/page.tsx`

- [ ] **Step 1: Fix note detail page duplicate title**

In `app/note/[id]/page.tsx`, change the Header title from `note.title` to `"Note"`:

```tsx
<Header
  title="Note"
  breadcrumbs={[{ label: "Notes", href: "/notes" }]}
```

Keep the Card `<h1>` as `note.title`.

- [ ] **Step 2: Fix note update page title**

In `app/note/[id]/update/page.tsx`, change the Header title from the template literal to `"Update Note"`:

```tsx
<Header
  title="Update Note"
```

- [ ] **Step 3: Fix ticket detail page breadcrumbs**

In `app/repository/[id]/ticket/[ticketId]/page.tsx`, add repository context to breadcrumbs:

```tsx
<Header
  breadcrumbs={[
    { label: "Repositories", href: "/repositories" },
    { label: repo.name, href: `/repository/${repo.id}` },
  ]}
  title={`Ticket #${ticket.id}`}
```

- [ ] **Step 4: Fix ticket create page breadcrumbs**

In `app/repository/[id]/ticket/create/page.tsx`, add repository context to breadcrumbs:

```tsx
<Header
  breadcrumbs={[
    { label: "Repositories", href: "/repositories" },
    { label: repo.name, href: `/repository/${repo.id}` },
  ]}
  title="Create Ticket"
```

- [ ] **Step 5: Verify**

Run: `& "C:\Program Files\nodejs\npm.cmd" run build`
Expected: Compiles.

Run: `& "C:\Program Files\nodejs\npm.cmd" run lint`
Expected: No errors.
