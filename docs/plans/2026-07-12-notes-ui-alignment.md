# Notes UI Alignment Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make all Notes pages follow the same UI structure and layout patterns as Repositories and Tickets pages.

**Architecture:** Direct fixes to existing Note-related components and pages. No new files needed — just aligning class names, nesting patterns, and empty states to match the established conventions.

**Tech Stack:** Next.js App Router, React, Tailwind CSS

---

## Patterns to Match

**Repository/Ticket create pages:**
- Fragment `<>` wrapper (not `<div>`)
- Header component
- Single Card with `<h1 className="text-xl font-bold border-b border-gray-200 dark:border-gray-800 pb-4">` title
- Form inside `<div className="pt-4">`

**Repository/Ticket update pages:**
- Fragment `<>` wrapper
- Header with Delete button in actions
- Single Card wrapping bare form (no title inside Card)

**Repository/Ticket forms:**
- Bare `<form className="flex flex-col gap-3">` (no Card wrapper)
- Labels: `text-sm font-medium text-gray-700 dark:text-gray-300`
- Inputs: full dark mode classes
- Footer: `border-t border-gray-200 dark:border-gray-800 pt-4 mt-4 flex justify-end`
- Submit button: inline styles, no Button component, no Cancel button

**Repository detail page:**
- Fragment `<>` wrapper
- Card with title, content, and metadata

---

### Task 1: Fix Note Create Page Wrapper

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
  <Card>
    <h1 className="text-xl font-bold border-b border-gray-200 dark:border-gray-800 pb-4">Create Note</h1>
    <div className="pt-4">
      <CreateNoteForm />
    </div>
  </Card>
</>
```

**Step 2: Verify**

Run: `npm run build`
Expected: No errors

**Step 3: Commit**

```bash
git add app/notes/create/page.tsx
git commit -m "fix: align note create page structure with repositories/tickets"
```

---

### Task 2: Fix CreateNoteForm Structure

**Files:**
- Modify: `app/components/CreateNoteForm.tsx`

**Step 1: Remove Card wrapper and align with Repository/Ticket form patterns**

Current:
```tsx
<form action={action}>
  <Card>
    <Card className="border-b p-6">
      <h2 className="text-lg font-bold">Create Note</h2>
    </Card>
    <Card className="p-6 flex flex-col gap-6">
      {state?.error && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}
      <div className="flex flex-col gap-2">
        <label htmlFor="title" className="text-sm font-medium">Title</label>
        <input id="title" name="title" required className="rounded border px-3 py-2 text-sm" />
      </div>
      ...
    </Card>
    <Card className="border-t p-6 flex items-center justify-between">
      <Button type="button" variant="secondary" onClick={() => history.back()}>Cancel</Button>
      <Button type="submit" disabled={pending}>Create Note</Button>
    </Card>
  </Card>
</form>
```

Change to:
```tsx
<form action={action} className="flex flex-col gap-3">
  {state && "error" in state && (
    <p className="text-sm text-red-500">{state.error}</p>
  )}
  <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="note-title">Title</label>
  <input
    id="note-title"
    name="title"
    required
    className="rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
  />
  <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="note-content">Content</label>
  <textarea
    id="note-content"
    name="content"
    rows={10}
    className="rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 resize-y whitespace-pre-wrap"
  />
  <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="note-keywords">Keywords</label>
  <input
    id="note-keywords"
    name="keywords"
    placeholder="Comma separated (e.g., bug, urgent, api)"
    className="rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
  />
  <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mt-4 flex justify-end">
    <button
      type="submit"
      disabled={pending}
      className="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 disabled:opacity-50 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:focus-visible:outline-white"
    >
      {pending ? "Creating..." : "Create Note"}
    </button>
  </div>
</form>
```

**Step 2: Remove unused imports**

Remove imports for `Button` and `Card` (no longer used).

**Step 3: Verify**

Run: `npm run build`
Expected: No errors

**Step 4: Commit**

```bash
git add app/components/CreateNoteForm.tsx
git commit -m "fix: align CreateNoteForm with other form components"
```

---

### Task 3: Fix Note Update Page Structure

**Files:**
- Modify: `app/note/[id]/update/page.tsx`

**Step 1: Add Card wrapper to match Repository/Ticket update pages**

Current:
```tsx
<>
  <Header ... />
  <UpdateNoteForm note={note} />
</>
```

Change to:
```tsx
<>
  <Header ... />
  <Card>
    <UpdateNoteForm note={note} />
  </Card>
</>
```

**Step 2: Verify**

Run: `npm run build`
Expected: No errors

**Step 3: Commit**

```bash
git add app/note/[id]/update/page.tsx
git commit -m "fix: align note update page structure with repositories/tickets"
```

---

### Task 4: Fix UpdateNoteForm Structure

**Files:**
- Modify: `app/components/UpdateNoteForm.tsx`

**Step 1: Remove Card wrapper and align with Repository/Ticket form patterns**

Current:
```tsx
<form action={action}>
  <input type="hidden" name="noteId" value={note.id} />
  <Card>
    <Card className="border-b p-6">
      <h2 className="text-lg font-bold">Update Note</h2>
    </Card>
    <Card className="p-6 flex flex-col gap-6">
      ...
    </Card>
    <Card className="border-t p-6 flex items-center justify-between">
      <Button type="button" variant="secondary" onClick={() => history.back()}>Cancel</Button>
      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>Update Note</Button>
      </div>
    </Card>
  </Card>
</form>
```

Change to:
```tsx
<form action={action} className="flex flex-col gap-3">
  <input type="hidden" name="noteId" value={note.id} />
  {state && "error" in state && (
    <p className="text-sm text-red-500">{state.error}</p>
  )}
  <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="note-title">Title</label>
  <input
    id="note-title"
    name="title"
    required
    defaultValue={note.title}
    className="rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
  />
  <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="note-content">Content</label>
  <textarea
    id="note-content"
    name="content"
    rows={10}
    defaultValue={note.content}
    className="rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 resize-y whitespace-pre-wrap"
  />
  <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="note-keywords">Keywords</label>
  <input
    id="note-keywords"
    name="keywords"
    defaultValue={note.keywords.join(", ")}
    placeholder="Comma separated (e.g., bug, urgent, api)"
    className="rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
  />
  <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mt-4 flex justify-end">
    <button
      type="submit"
      disabled={pending}
      className="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 disabled:opacity-50 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:focus-visible:outline-white"
    >
      {pending ? "Saving..." : "Save Changes"}
    </button>
  </div>
</form>
```

**Step 2: Remove unused imports**

Remove imports for `Button` and `Card` (no longer used).

**Step 3: Verify**

Run: `npm run build`
Expected: No errors

**Step 4: Commit**

```bash
git add app/components/UpdateNoteForm.tsx
git commit -m "fix: align UpdateNoteForm with other form components"
```

---

### Task 5: Fix Note Detail Page Structure

**Files:**
- Modify: `app/note/[id]/page.tsx`

**Step 1: Replace wrapper and fix nesting**

Current:
```tsx
<div className="flex flex-col gap-6">
  <Header ... />
  <Card>
    <Card className="p-6">
      {note.keywords.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-4">
          {note.keywords.map((keyword) => (
            <span key={keyword} className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-300">
              {keyword}
            </span>
          ))}
        </div>
      )}
      {note.content ? (
        <p className="whitespace-pre-wrap">{note.content}</p>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 italic">No content</p>
      )}
    </Card>
    <Card className="border-t p-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
      <span>Created {formatDate(note.createdAt)}</span>
      <span>Updated {formatDate(note.updatedAt)}</span>
    </Card>
  </Card>
</div>
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

**Step 2: Remove unused imports**

Remove `formatDate` import (no longer used in this file).

**Step 3: Verify**

Run: `npm run build`
Expected: No errors

**Step 4: Commit**

```bash
git add app/note/[id]/page.tsx
git commit -m "fix: align note detail page structure with repositories/tickets"
```

---

### Task 6: Fix Notes List Empty State and Remove Dates

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

**Step 2: Remove dates from list items**

Current:
```tsx
<div className="mt-3 text-xs text-gray-500 dark:text-gray-500">
  Created {formatDate(note.createdAt)} · Updated {formatDate(note.updatedAt)}
</div>
```

Remove this div entirely.

**Step 3: Remove unused imports**

Remove `formatDate` and `Button` imports (no longer used).

**Step 4: Verify**

Run: `npm run build`
Expected: No errors

**Step 5: Commit**

```bash
git add app/notes/page.tsx
git commit -m "fix: align notes list with repositories/tickets patterns"
```

---

## Summary of All Changes

| File | Change |
|------|--------|
| `app/notes/create/page.tsx` | Fragment wrapper, add Card with title header |
| `app/components/CreateNoteForm.tsx` | Remove Card wrapper, use bare form, add dark mode styles, remove Cancel button |
| `app/note/[id]/update/page.tsx` | Add Card wrapper |
| `app/components/UpdateNoteForm.tsx` | Remove Card wrapper, use bare form, remove Cancel button |
| `app/note/[id]/page.tsx` | Fragment wrapper, remove nested Cards, fix keyword border-radius |
| `app/notes/page.tsx` | Simplify empty state, remove dates |
