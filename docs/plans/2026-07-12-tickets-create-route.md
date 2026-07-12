# Tickets Create Route Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the repo-scoped ticket create route with a top-level `/tickets/create` page that has a Repository dropdown, pre-selects a repo when linked from a repository page, and is reachable from the Tickets list header.

**Architecture:** Add a new `app/tickets/create/page.tsx` (mirrors `app/repository/create/page.tsx` and `app/notes/create/page.tsx`). The `CreateTicketForm` is changed from a hidden `repositoryId` input to a visible, required Repository `<select>` that takes the full repository list and an optional default selection. The repo view page and the Tickets list header link to `/tickets/create?repository_id=...`. The now-orphaned `app/repository/[id]/ticket/create/page.tsx` is deleted.

**Tech Stack:** Next.js App Router, React, Tailwind CSS, better-sqlite3 (read-only via `getRepositories`)

---

## Context

- `app/tickets/page.tsx` currently puts `TicketFilters` in the header `actions` slot and has **no** "Create Ticket" button.
- `app/repository/[id]/page.tsx` links its "Create Ticket" button to `/repository/${repo.id}/ticket/create`.
- `app/repository/[id]/ticket/create/page.tsx` hardcodes the repo via `<CreateTicketForm repositoryId={repo.id} />` (hidden input).
- `app/components/CreateTicketForm.tsx` takes a required `repositoryId: string` prop and renders it as a hidden input.
- `app/repository/create/page.tsx` and `app/notes/create/page.tsx` are the established pattern for "create" pages: Header + Card with `<h1>` title + form inside `<div className="pt-4">`.
- `lib/db.ts` exposes `getRepositories(): Repository[]` and `Repository` type.
- The Tickets list already uses the query param name `repository_id` (underscore) for filtering — we reuse that exact name for the pre-selection param so it's consistent.
- This repo has **no test suite** (see AGENTS.md). Verification is `npm run build` + `npm run lint`, plus a manual browser check.

---

### Task 1: Update CreateTicketForm to use a Repository dropdown

**Files:**
- Modify: `app/components/CreateTicketForm.tsx`

**Step 1: Change props and replace hidden input with a select**

Replace the function signature and the hidden input. New top of component:

```tsx
import type { Repository } from "@/lib/db"

export default function CreateTicketForm({
  repositories,
  defaultRepositoryId,
}: {
  repositories: Repository[]
  defaultRepositoryId?: string
}) {
  const [state, action, pending] = useActionState(createTicketAction, null)
```

Replace the hidden input (currently `<input type="hidden" name="repositoryId" value={repositoryId} />`):

```tsx
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="ticket-repository">Repository</label>
      <select
        id="ticket-repository"
        name="repositoryId"
        defaultValue={defaultRepositoryId ?? ""}
        required
        className="rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-black dark:focus:border-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 cursor-pointer"
      >
        <option value="" disabled>Select a repository</option>
        {repositories.map((repo) => (
          <option key={repo.id} value={repo.id}>{repo.name}</option>
        ))}
      </select>
```

Keep the title, description, status, error, and submit button sections exactly as they are.

**Step 2: Verify**

Run: `npm run build`
Expected: Compiles (other pages still reference the old prop — expect a type error until Task 2/3 update them; that's fine at this step, but confirm the form file itself has no syntax errors).

**Step 3: Commit**

```bash
git add app/components/CreateTicketForm.tsx
git commit -m "feat: CreateTicketForm uses Repository dropdown instead of hidden input"
```

---

### Task 2: Create the top-level /tickets/create page

**Files:**
- Create: `app/tickets/create/page.tsx`

**Step 1: Write the page**

```tsx
import { getRepositories } from "@/lib/db"
import Header from "@/app/components/Header"
import Card from "@/app/components/Card"
import CreateTicketForm from "@/app/components/CreateTicketForm"

export default async function NewTicketPage({
  searchParams,
}: {
  searchParams: Promise<{ repository_id?: string }>
}) {
  const { repository_id } = await searchParams
  const repositories = getRepositories()

  return (
    <>
      <Header
        breadcrumbs={[{ label: "Tickets", href: "/tickets" }]}
        title="Create Ticket"
      />
      <Card>
        <h1 className="text-xl font-bold border-b border-gray-200 dark:border-gray-800 pb-4">Create Ticket</h1>
        <div className="pt-4">
          <CreateTicketForm repositories={repositories} defaultRepositoryId={repository_id} />
        </div>
      </Card>
    </>
  )
}
```

**Step 2: Verify**

Run: `npm run build`
Expected: New route `/tickets/create` compiles. (The old repo create page and repo view page still pass the old `repositoryId` string prop — type errors expected until Task 3 fixes them.)

**Step 3: Commit**

```bash
git add app/tickets/create/page.tsx
git commit -m "feat: add top-level /tickets/create page with Repository dropdown"
```

---

### Task 3: Point the repo view "Create Ticket" button at the new route

**Files:**
- Modify: `app/repository/[id]/page.tsx`

**Step 1: Change the link href**

In the header `actions`, change:

```tsx
<Link href={`/repository/${repo.id}/ticket/create`}>
  <Button variant="primary">Create Ticket</Button>
</Link>
```

to:

```tsx
<Link href={`/tickets/create?repository_id=${repo.id}`}>
  <Button variant="primary">Create Ticket</Button>
</Link>
```

**Step 2: Verify**

Run: `npm run build`
Expected: `app/repository/[id]/page.tsx` compiles; no more reference to the old `CreateTicketForm` string prop.

**Step 3: Commit**

```bash
git add app/repository/[id]/page.tsx
git commit -m "feat: link repo Create Ticket button to /tickets/create with repository_id"
```

---

### Task 4: Add "Create Ticket" button to the Tickets list header

**Files:**
- Modify: `app/tickets/page.tsx`

**Step 1: Add the button alongside TicketFilters**

Change the Header `actions` from:

```tsx
actions={<TicketFilters repositories={repositories} />}
```

to:

```tsx
actions={
  <div className="flex items-center gap-2">
    <TicketFilters repositories={repositories} />
    <Link href="/tickets/create">
      <Button>Create Ticket</Button>
    </Link>
  </div>
}
```

Add the `Link` and `Button` imports if not already present (they are both currently imported in this file: `Link` at line 1, `Button` is NOT imported yet — add `import Button from "../components/Button"`).

**Step 2: Verify**

Run: `npm run build`
Expected: Compiles. `app/tickets/page.tsx` now shows the filter + Create Ticket button in the header.

Run: `npm run lint`
Expected: No errors.

**Step 3: Commit**

```bash
git add app/tickets/page.tsx
git commit -m "feat: add Create Ticket button to Tickets list header"
```

---

### Task 5: Delete the orphaned repo-scoped create route

**Files:**
- Delete: `app/repository/[id]/ticket/create/page.tsx`

**Step 1: Remove the file**

Run:
```bash
rm "app/repository/[id]/ticket/create/page.tsx"
```

(Use bash; the brackets are literal folder names in the repo.)

**Step 2: Verify**

Run: `npm run build`
Expected: Compiles with no references to the deleted route. Search the repo for `ticket/create` to confirm no remaining links.

**Step 3: Commit**

```bash
git add -A
git commit -m "refactor: remove orphaned /repository/[id]/ticket/create route"
```

---

### Task 6: Manual verification

Run: `npm run dev`

Check:
1. `http://localhost:3000/tickets/create` loads with a Repository dropdown.
2. From `http://localhost:3000/repository/<id>`, clicking "Create Ticket" opens `/tickets/create?repository_id=<id>` and the dropdown is pre-selected to that repo.
3. On `/tickets/create`, leaving the dropdown on "Select a repository" and submitting shows the required-validation error (no crash).
4. Selecting a repo + filling title + submit creates the ticket and redirects to its detail page.
5. `/tickets` header shows both the filters and a "Create Ticket" button linking to `/tickets/create`.

---

## Summary of changes

| File | Change |
|------|--------|
| `app/components/CreateTicketForm.tsx` | Hidden `repositoryId` input → required Repository `<select>`; new props `repositories`, `defaultRepositoryId` |
| `app/tickets/create/page.tsx` | New page (Header + Card + form), reads `repository_id` |
| `app/repository/[id]/page.tsx` | "Create Ticket" link → `/tickets/create?repository_id=...` |
| `app/tickets/page.tsx` | Header actions get a "Create Ticket" button |
| `app/repository/[id]/ticket/create/page.tsx` | Deleted (orphaned) |
