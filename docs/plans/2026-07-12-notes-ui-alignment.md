# Notes UI Alignment Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make all Notes pages follow the same UI structure and layout patterns as Repositories and Tickets pages.

**Architecture:** Direct fixes to existing Note-related components and pages. No new files needed — just aligning class names, nesting patterns, and empty states to match the established conventions.

**Tech Stack:** Next.js App Router, React, Tailwind CSS

---

## Differences Found

| Area | Repositories/Tickets Pattern | Notes Current State |
|------|------------------------------|---------------------|
| Page wrapper | `<>` fragment | `<div className="flex flex-col gap-6">` (detail, create) |
| Empty state | Simple `<Card><p>` | Extra padding, CTA button |
| List dates | Not shown | `formatDate` shown |
| Form nesting | Single Card wrapper | Nested Cards (Card > Card) |
| Keywords | `rounded` | `rounded-full` |
| Form input styles | Full dark mode classes | Mixed (CreateNoteForm missing dark mode) |

---

### Task 1: Fix Note Detail Page Structure

**Files:**
- Modify: `app/note/[id]/page.tsx`

**Step 1: Replace wrapper and fix nesting**

Current:
```tsx
<div className="flex flex-col gap-6">
  <Header ... />
  <Card>
    <Card className="p-6">
```

Change to:
```tsx
<>
  <Header ... />
  <Card>
    <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
      <h1 className="text-xl font-bold">{note.title}</h1>
    </div>
    {note.keywords.length > 0 && (
      <div className="flex gap-2 flex-wrap pt-4">
        {note.keywords.map((keyword) => (
          <span key={keyword} className="inline-flex items-center rounded bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-300">
            {keyword}
          </span>
        ))}
      </div>
    )}
    {note.content ? (
      <div className="pt-4">
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{note.content}</p>
      </div>
    ) : (
      <div className="pt-4">
        <p className="text-sm text-gray-500 italic">No content</p>
      </div>
    )}
  </Card>
</>
```

**Step 2: Verify**

Run: `npm run build`
Expected: No errors

**Step 3: Commit**

```bash
git add app/note/[id]/page.tsx
git commit -m "fix: align note detail page structure with repositories/tickets"
```

---

### Task 2: Fix Notes List Empty State

**Files:**
- Modify: `app/notes/page.tsx`

**Step 1: Simplify empty state**

Current:
```tsx
<Card className="p-12 text-center">
  <p className="text-gray-500 dark:text-gray-400 mb-4">No notes yet</p>
  <Link href="/notes/create">
    <Button>Create Your First Note</Button>
  </Link>
</Card>
```

Change to:
```tsx
<Card>
  <p className="text-sm text-gray-500">No notes found.</p>
</Card>
```

**Step 2: Remove unused imports if any**

Check if `Button` import is still needed. Remove if unused.

**Step 3: Verify**

Run: `npm run build`
Expected: No errors

**Step 4: Commit**

```bash
git add app/notes/page.tsx
git commit -m "fix: align notes list empty state with repositories/tickets"
```

---

### Task 3: Remove Dates from Notes List

**Files:**
- Modify: `app/notes/page.tsx`

**Step 1: Remove formatDate import and date display**

Current:
```tsx
import { formatDate } from "@/lib/utils"
```
and:
```tsx
<div className="mt-3 text-xs text-gray-500 dark:text-gray-500">
  Created {formatDate(note.createdAt)} · Updated {formatDate(note.updatedAt)}
</div>
```

Remove the import and the date div.

**Step 2: Verify**

Run: `npm run build`
Expected: No errors

**Step 3: Commit**

```bash
git add app/notes/page.tsx
git commit -m "fix: remove dates from notes list to match other list pages"
```

---

### Task 4: Fix CreateNoteForm Dark Mode and Nesting

**Files:**
- Modify: `app/components/CreateNoteForm.tsx`

**Step 1: Fix nested Cards and input styles**

Replace the nested Card structure with single Card wrapping content. Update input styles to match other forms.

Current:
```tsx
<Card>
  <Card className="border-b p-6">
    <h2 className="text-lg font-bold">Create Note</h2>
  </Card>
  <Card className="p-6 flex flex-col gap-6">
    ...
    <input className="rounded border px-3 py-2 text-sm" />
    ...
  </Card>
  <Card className="border-t p-6 flex items-center justify-between">
    ...
  </Card>
</Card>
```

Change to:
```tsx
<Card>
  <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
    <h2 className="text-lg font-bold">Create Note</h2>
  </div>
  <div className="pt-4 flex flex-col gap-4">
    {state?.error && (
      <p className="text-sm text-red-500">{state.error}</p>
    )}
    <div className="flex flex-col gap-2">
      <label htmlFor="title" className="text-sm font-medium">Title</label>
      <input
        id="title"
        name="title"
        required
        className="rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
      />
    </div>
    <div className="flex flex-col gap-2">
      <label htmlFor="content" className="text-sm font-medium">Content</label>
      <textarea
        id="content"
        name="content"
        rows={10}
        className="rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 resize-y whitespace-pre-wrap placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
      />
    </div>
    <div className="flex flex-col gap-2">
      <label htmlFor="keywords" className="text-sm font-medium">Keywords</label>
      <input
        id="keywords"
        name="keywords"
        placeholder="Comma separated (e.g., bug, urgent, api)"
        className="rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
      />
    </div>
    <div className="flex justify-end">
      <Button type="submit" disabled={pending}>Create Note</Button>
    </div>
  </div>
</Card>
```

**Step 2: Verify**

Run: `npm run build`
Expected: No errors

**Step 3: Commit**

```bash
git add app/components/CreateNoteForm.tsx
git commit -m "fix: align CreateNoteForm with other form components"
```

---

### Task 5: Fix UpdateNoteForm Nesting

**Files:**
- Modify: `app/components/UpdateNoteForm.tsx`

**Step 1: Fix nested Cards structure**

Current:
```tsx
<Card>
  <Card className="border-b p-6">
    <h2 className="text-lg font-bold">Update Note</h2>
  </Card>
  <Card className="p-6 flex flex-col gap-6">
    ...
  </Card>
  <Card className="border-t p-6 flex items-center justify-between">
    ...
  </Card>
</Card>
```

Change to:
```tsx
<Card>
  <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
    <h2 className="text-lg font-bold">Update Note</h2>
  </div>
  <div className="pt-4 flex flex-col gap-4">
    {state?.error && (
      <p className="text-sm text-red-500">{state.error}</p>
    )}
    <div className="flex flex-col gap-2">
      <label htmlFor="title" className="text-sm font-medium">Title</label>
      <input
        id="title"
        name="title"
        required
        defaultValue={note.title}
        className="rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
      />
    </div>
    <div className="flex flex-col gap-2">
      <label htmlFor="content" className="text-sm font-medium">Content</label>
      <textarea
        id="content"
        name="content"
        rows={10}
        defaultValue={note.content}
        className="rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 resize-y whitespace-pre-wrap placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
      />
    </div>
    <div className="flex flex-col gap-2">
      <label htmlFor="keywords" className="text-sm font-medium">Keywords</label>
      <input
        id="keywords"
        name="keywords"
        defaultValue={note.keywords.join(", ")}
        placeholder="Comma separated (e.g., bug, urgent, api)"
        className="rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
      />
    </div>
    <div className="flex justify-end">
      <Button type="submit" disabled={pending}>Update Note</Button>
    </div>
  </div>
</Card>
```

**Step 2: Verify**

Run: `npm run build`
Expected: No errors

**Step 3: Commit**

```bash
git add app/components/UpdateNoteForm.tsx
git commit -m "fix: align UpdateNoteForm with other form components"
```

---

### Task 6: Fix Note Create Page Wrapper

**Files:**
- Modify: `app/notes/create/page.tsx`

**Step 1: Replace div wrapper with fragment**

Current:
```tsx
<div className="flex flex-col gap-6">
  <Header ... />
  <CreateNoteForm />
</div>
```

Change to:
```tsx
<>
  <Header ... />
  <CreateNoteForm />
</>
```

**Step 2: Verify**

Run: `npm run build`
Expected: No errors

**Step 3: Commit**

```bash
git add app/notes/create/page.tsx
git commit -m "fix: use fragment wrapper on note create page"
```

---

## Summary of All Changes

| File | Change |
|------|--------|
| `app/note/[id]/page.tsx` | Fragment wrapper, remove nested Cards, fix keyword border-radius |
| `app/notes/page.tsx` | Simplify empty state, remove dates |
| `app/components/CreateNoteForm.tsx` | Remove nested Cards, add dark mode input styles |
| `app/components/UpdateNoteForm.tsx` | Remove nested Cards |
| `app/notes/create/page.tsx` | Fragment wrapper |
