# UI/UX Consistency Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all UI/UX inconsistencies across components and layouts for a uniform look and feel.

**Architecture:** Systematic fixes to spacing, dark mode, button variants, breadcrumbs, form layouts, and import paths. Each task groups related fixes.

**Tech Stack:** React 19, Next.js App Router, Tailwind CSS 4, TypeScript

## Global Constraints

- No test suite — verification via `npm run build` + `npm run lint`
- No git commits — all git commands are skipped
- Solo use, no auth
- Node.js path: `& "C:\Program Files\nodejs\npm.cmd" run build`

---

### Task 1: Fix Card Spacing (notes/page.tsx)

**Files:**
- Modify: `app/notes/page.tsx`

**Interfaces:**
- Consumes: nothing
- Produces: consistent card padding matching all other pages

- [ ] **Step 1: Fix header padding from pb-3 to pb-4**

In `app/notes/page.tsx`, line 56, change `pb-3` to `pb-4`:

```tsx
<div className="-mx-4 px-4 pb-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
```

- [ ] **Step 2: Fix footer spacing from pt-3 mt-3 to pt-4 mt-4**

In `app/notes/page.tsx`, line 70, change `pt-3 mt-3` to `pt-4 mt-4`:

```tsx
<div className="-mx-4 px-4 pt-4 mt-4 border-t border-gray-200 dark:border-gray-800 flex gap-2 flex-wrap">
```

- [ ] **Step 3: Verify**

Run: `& "C:\Program Files\nodejs\npm.cmd" run build`
Expected: Compiles.

---

### Task 2: Fix Form Layout Inconsistencies

**Files:**
- Modify: `app/components/CommentForm.tsx`
- Modify: `app/components/CreateNoteForm.tsx`
- Modify: `app/components/UpdateNoteForm.tsx`

**Interfaces:**
- Consumes: nothing
- Produces: consistent form gap, error placement, and footer spacing

- [ ] **Step 1: Fix CommentForm gap from gap-2 to gap-3**

In `app/components/CommentForm.tsx`, line 17, change `gap-2` to `gap-3`:

```tsx
<form action={formAction} className="flex flex-col gap-3">
```

- [ ] **Step 2: Fix CommentForm footer margin from mt-2 to mt-4**

In `app/components/CommentForm.tsx`, line 34, change `mt-2` to `mt-4`:

```tsx
<div className="-mx-4 px-4 pt-4 mt-4 border-t border-gray-200 dark:border-gray-800 flex justify-end">
```

- [ ] **Step 3: Fix CreateNoteForm error placement**

In `app/components/CreateNoteForm.tsx`, move the error message from the top (lines 12-14) to just before the submit footer. The final order should be: fields, error, submit button.

Current:
```tsx
  return (
    <form action={action} className="flex flex-col gap-3">
      {state?.error && <p className="text-xs text-red-500">{state.error}</p>}
      <div>
        <label htmlFor="note-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Title
        </label>
        ...fields...
      </div>
      <div className="-mx-4 px-4 pt-4 mt-4 border-t border-gray-200 dark:border-gray-800 flex justify-end">
```

New:
```tsx
  return (
    <form action={action} className="flex flex-col gap-3">
      <div>
        <label htmlFor="note-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Title
        </label>
        ...fields...
      </div>
      {state?.error && <p className="text-xs text-red-500">{state.error}</p>}
      <div className="-mx-4 px-4 pt-4 mt-4 border-t border-gray-200 dark:border-gray-800 flex justify-end">
```

- [ ] **Step 4: Fix UpdateNoteForm error placement**

In `app/components/UpdateNoteForm.tsx`, move the error message from lines 14-16 to just before the submit footer (after the keywords field, before the `<div className="-mx-4 px-4 pt-4...`).

Current:
```tsx
  return (
    <form action={action} className="flex flex-col gap-3">
      {state?.error && <p className="text-xs text-red-500">{state.error}</p>}
      <div>
        ...fields...
      </div>
      <div className="-mx-4 px-4 pt-4 mt-4 border-t...">
```

New:
```tsx
  return (
    <form action={action} className="flex flex-col gap-3">
      <div>
        ...fields...
      </div>
      {state?.error && <p className="text-xs text-red-500">{state.error}</p>}
      <div className="-mx-4 px-4 pt-4 mt-4 border-t...">
```

- [ ] **Step 5: Verify**

Run: `& "C:\Program Files\nodejs\npm.cmd" run build`
Expected: Compiles.

---

### Task 3: Fix Header and Breadcrumb Inconsistencies

**Files:**
- Modify: `app/note/[id]/page.tsx`
- Modify: `app/note/[id]/update/page.tsx`
- Modify: `app/repository/[id]/ticket/[ticketId]/page.tsx`
- Modify: `app/repository/[id]/ticket/create/page.tsx`

**Interfaces:**
- Consumes: nothing
- Produces: consistent header titles and breadcrumb depth

- [ ] **Step 1: Fix note detail page duplicate title**

In `app/note/[id]/page.tsx`, change the Header title from `note.title` to `"Note"`:

```tsx
<Header
  title="Note"
  breadcrumbs={[{ label: "Notes", href: "/notes" }]}
```

Keep the Card `<h1>` as `note.title` — this matches the pattern on other detail pages where Header shows a generic label and Card shows the entity name.

- [ ] **Step 2: Fix note update page title**

In `app/note/[id]/update/page.tsx`, change the Header title from `` `Update Note: ${note.title}` `` to `"Update Note"`:

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

---

### Task 4: Fix Button Style Inconsistencies

**Files:**
- Modify: `app/repository/[id]/page.tsx`
- Modify: `app/components/Button.tsx`
- Modify: `app/components/ConfirmModal.tsx`

**Interfaces:**
- Consumes: nothing
- Produces: consistent button variants and disabled states

- [ ] **Step 1: Fix "Update Repository" button to primary**

In `app/repository/[id]/page.tsx`, line 23, change `variant="secondary"` to `variant="primary"`:

```tsx
<Link href={`/repository/${repo.id}/update`}>
  <Button>Update Repository</Button>
</Link>
```

This matches "Update Ticket" and "Update Note" which use the default primary variant.

- [ ] **Step 2: Add disabled:cursor-not-allowed to Button component**

In `app/components/Button.tsx`, line 23, add `disabled:cursor-not-allowed` to the button className:

```tsx
className={`rounded px-4 py-2 text-sm font-medium whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:focus-visible:outline-white disabled:cursor-not-allowed ${variants[variant]} ${className}`}
```

- [ ] **Step 3: Add disabled:opacity-50 and disabled:cursor-not-allowed to ConfirmModal delete button**

In `app/components/ConfirmModal.tsx`, line 53, add disabled styles:

```tsx
className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
```

- [ ] **Step 4: Verify**

Run: `& "C:\Program Files\nodejs\npm.cmd" run build`
Expected: Compiles.

---

### Task 5: Fix Text Styling and Dark Mode

**Files:**
- Modify: `app/repository/[id]/ticket/[ticketId]/page.tsx`
- Modify: `app/page.tsx`
- Modify: `app/repositories/page.tsx`
- Modify: `app/repository/[id]/TicketList.tsx`
- Modify: `app/tickets/page.tsx`
- Modify: `app/notes/page.tsx`
- Modify: `app/repository/[id]/page.tsx`
- Modify: `app/note/[id]/page.tsx`

**Interfaces:**
- Consumes: nothing
- Produces: consistent text styling and dark mode variants

- [ ] **Step 1: Add leading-relaxed to comment text**

In `app/repository/[id]/ticket/[ticketId]/page.tsx`, line 57, add `leading-relaxed`:

```tsx
<p className="text-sm leading-relaxed whitespace-pre-wrap">{comment.text}</p>
```

- [ ] **Step 2: Fix dashboard stat label dark mode**

In `app/page.tsx`, line 26, add `dark:text-gray-400`:

```tsx
<p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
```

- [ ] **Step 3: Add dark:text-gray-400 to all empty state text**

Add `dark:text-gray-400` to the empty state `<p>` in these files:

`app/repositories/page.tsx` line 37:
```tsx
<p className="text-center text-sm text-gray-500 dark:text-gray-400">No repositories yet.</p>
```

`app/repository/[id]/TicketList.tsx` line 46:
```tsx
<p className="text-center text-sm text-gray-500 dark:text-gray-400">
```

`app/tickets/page.tsx` line 44:
```tsx
<p className="text-center text-sm text-gray-500 dark:text-gray-400">No tickets found.</p>
```

`app/notes/page.tsx` line 49:
```tsx
<p className="text-center text-sm text-gray-500 dark:text-gray-400">No notes found.</p>
```

`app/repository/[id]/page.tsx` line 49:
```tsx
<p className="text-sm text-gray-500 dark:text-gray-400 italic">No content</p>
```

`app/repository/[id]/ticket/[ticketId]/page.tsx` line 48:
```tsx
<p className="text-sm text-gray-500 dark:text-gray-400 italic">No content</p>
```

`app/note/[id]/page.tsx` line 38:
```tsx
<p className="text-sm text-gray-500 dark:text-gray-400 italic">No content</p>
```

- [ ] **Step 4: Add dark:text-gray-400 to "in {repoName}" text**

In `app/tickets/page.tsx`, line 56:

```tsx
<span className="text-sm text-gray-500 dark:text-gray-400">in {ticket.repoName}</span>
```

- [ ] **Step 5: Verify**

Run: `& "C:\Program Files\nodejs\npm.cmd" run build`
Expected: Compiles.

---

### Task 6: Fix Remaining Visual Inconsistencies

**Files:**
- Modify: `app/tickets/page.tsx`
- Modify: `app/repository/[id]/ticket/[ticketId]/page.tsx`
- Modify: `app/components/StatusDropdown.tsx`
- Modify: `app/components/NoteSearch.tsx`

**Interfaces:**
- Consumes: nothing
- Produces: consistent imports, spacing, disabled states, and input sizing

- [ ] **Step 1: Fix tickets/page.tsx imports to use @/ alias**

In `app/tickets/page.tsx`, change all relative imports to use the `@/` alias:

```tsx
import { getTickets } from "@/lib/db"
import Header from "@/app/components/Header"
import Card from "@/app/components/Card"
import Badge from "@/app/components/Badge"
import Pagination from "@/app/components/Pagination"
```

- [ ] **Step 2: Fix comment section gap from gap-3 to gap-2**

In `app/repository/[id]/ticket/[ticketId]/page.tsx`, line 53, change `gap-3` to `gap-2`:

```tsx
<div className="flex flex-col gap-2">
```

- [ ] **Step 3: Add disabled:cursor-not-allowed to StatusDropdown**

In `app/components/StatusDropdown.tsx`, line 29, add `disabled:cursor-not-allowed`:

```tsx
<select
  id="ticket-status"
  name="status"
  defaultValue={status}
  disabled={pending}
  className="rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-black dark:focus:border-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
>
```

- [ ] **Step 4: Fix NoteSearch input width**

In `app/components/NoteSearch.tsx`, change `w-full` to `w-64`:

```tsx
<input
  type="text"
  name="q"
  placeholder="Search notes..."
  defaultValue={q}
  className="w-64 rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
/>
```

- [ ] **Step 5: Verify**

Run: `& "C:\Program Files\nodejs\npm.cmd" run build`
Expected: Compiles.

---

## Summary of Changes

| Task | Files Changed | Issues Fixed |
|------|--------------|--------------|
| 1 | `app/notes/page.tsx` | Card header/footer spacing |
| 2 | `CommentForm.tsx`, `CreateNoteForm.tsx`, `UpdateNoteForm.tsx` | Form gap, error placement, footer margin |
| 3 | `note/[id]/page.tsx`, `note/[id]/update/page.tsx`, `ticket/[ticketId]/page.tsx`, `ticket/create/page.tsx` | Duplicate title, breadcrumb depth |
| 4 | `repository/[id]/page.tsx`, `Button.tsx`, `ConfirmModal.tsx` | Button variants, disabled states |
| 5 | 8 files | Text leading, dark mode, empty states |
| 6 | `tickets/page.tsx`, `ticket/[ticketId]/page.tsx`, `StatusDropdown.tsx`, `NoteSearch.tsx` | Imports, gap, disabled cursor, input width |
