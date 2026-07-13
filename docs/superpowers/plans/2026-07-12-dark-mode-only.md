# Dark Mode Only Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove all light/dark theme support and make the app dark-only by removing `dark:` prefixed classes and the `prefers-color-scheme` media query.

**Architecture:** The CSS variables `--background` and `--foreground` are already set to dark values. We simply remove all `dark:` classes (which are now redundant) and the `prefers-color-scheme` media query. The `@theme` block with Material Design colors stays.

**Tech Stack:** Tailwind CSS 4, Next.js 16

## Global Constraints

- Do NOT modify the `@theme` block in `globals.css`
- Do NOT change any color values
- Do NOT add any new features
- Do NOT modify functionality
- Remove ALL `dark:` prefixed classes and the `prefers-color-scheme` media query

---

## File Structure

**Modified files:**
- `app/globals.css` — Remove `prefers-color-scheme` media query
- `app/components/Button.tsx` — Remove `dark:bg-blue-600`
- `app/components/Card.tsx` — Remove `dark:bg-gray-800`
- `app/components/Header.tsx` — Remove `dark:text-gray-100`
- `app/components/ConfirmModal.tsx` — Remove `dark:bg-gray-900`, `dark:text-gray-100`, `dark:border-gray-700`, `dark:hover:bg-gray-800`
- `app/components/DeleteButton.tsx` — Remove `dark:text-gray-400`, `dark:hover:text-red-400`
- `app/components/DeleteNoteButton.tsx` — Remove `dark:text-gray-400`, `dark:hover:text-red-400`
- `app/components/CopyContentButton.tsx` — Remove `dark:text-gray-400`, `dark:hover:text-green-400`
- `app/components/StatusDropdown.tsx` — Remove `dark:bg-gray-800`
- `app/components/NoteSearch.tsx` — Remove `dark:text-gray-400`, `dark:hover:text-green-400`
- `app/components/CommentForm.tsx` — Remove `dark:bg-gray-900`, `dark:text-gray-100`
- `app/components/CreateTicketForm.tsx` — Remove `dark:bg-gray-800`, `dark:text-gray-100`, `dark:border-gray-700`
- `app/components/TicketFilters.tsx` — Remove `dark:text-gray-400`
- `app/notes/page.tsx` — Remove `dark:text-gray-400`, `dark:border-gray-700`
- `app/tickets/page.tsx` — Remove `dark:text-gray-400`
- `app/note/[id]/page.tsx` — Remove `dark:text-gray-400`
- `app/repository/[id]/ticket/[ticketId]/page.tsx` — Remove `dark:text-gray-400`, `dark:border-gray-700`
- `app/repository/[id]/ticket/[ticketId]/update/page.tsx` — Remove `dark:text-gray-100`, `dark:border-gray-700`
- `lib/constants.ts` — Remove `dark:bg-orange-900/30`, `dark:text-orange-300`, `dark:bg-blue-900/30`, `dark:text-blue-300`, `dark:bg-green-900/30`, `dark:text-green-300`, `dark:bg-gray-700`, `dark:text-gray-300`

---

## Tasks

### Task 1: Update globals.css

**Files:**
- Modify: `app/globals.css:57-62`

**Interfaces:** None

- [ ] **Step 1: Remove `prefers-color-scheme` media query**

Remove lines 57-62 from `app/globals.css`:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --background: #212121;
    --foreground: #FAFAFA;
  }
}
```

The CSS variables at the top of the file (lines 32-34) already have these values, so this media query is redundant.

- [ ] **Step 2: Run build**

Run: `npm run build`
Expected: Build succeeds (no errors)

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "refactor: remove prefers-color-scheme media query, app is now dark-only"
```

---

### Task 2: Update lib/constants.ts

**Files:**
- Modify: `lib/constants.ts`

**Interfaces:** None

- [ ] **Step 1: Remove `dark:` classes from STATUS_COLORS**

Remove all `dark:` prefixed classes from the `STATUS_COLORS` object in `lib/constants.ts`:

```typescript
export const STATUS_COLORS: Record<Ticket["status"], string> = {
  pending: "bg-orange-100 text-orange-800",
  in_progress: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  archived: "bg-gray-100 text-gray-800",
};
```

- [ ] **Step 2: Run build**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add lib/constants.ts
git commit -m "refactor: remove dark: classes from status colors"
```

---

### Task 3: Update components (batch 1)

**Files:**
- Modify: `app/components/Button.tsx`
- Modify: `app/components/Card.tsx`
- Modify: `app/components/Header.tsx`
- Modify: `app/components/ConfirmModal.tsx`
- Modify: `app/components/DeleteButton.tsx`
- Modify: `app/components/DeleteNoteButton.tsx`

**Interfaces:** None

- [ ] **Step 1: Update Button.tsx**

Remove `dark:bg-blue-600` from the primary button className in `app/components/Button.tsx`:

```tsx
// Before
className="rounded-lg px-4 py-2 text-sm font-medium transition-colors bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"

// After
className="rounded-lg px-4 py-2 text-sm font-medium transition-colors bg-blue-500 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
```

- [ ] **Step 2: Update Card.tsx**

Remove `dark:bg-gray-800` from `app/components/Card.tsx`:

```tsx
// Before
<div className={`rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:bg-gray-800 ${className}`}>

// After
<div className={`rounded-xl border border-gray-200 bg-white p-4 shadow-sm ${className}`}>
```

- [ ] **Step 3: Update Header.tsx**

Remove `dark:text-gray-100` from the title className in `app/components/Header.tsx`:

```tsx
// Before
<h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">

// After
<h1 className="text-2xl font-bold text-gray-900">
```

- [ ] **Step 4: Update ConfirmModal.tsx**

Remove all `dark:` classes from `app/components/ConfirmModal.tsx`:

```tsx
// Before
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
  <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl dark:bg-gray-900 dark:border-gray-700">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
    <div className="mt-6 flex justify-end gap-3">
      <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">

// After
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
  <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl">
    <h3 className="text-lg font-semibold text-gray-900">
    <p className="mt-2 text-sm text-gray-600">
    <div className="mt-6 flex justify-end gap-3">
      <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
```

- [ ] **Step 5: Update DeleteButton.tsx**

Remove `dark:text-gray-400` and `dark:hover:text-red-400` from `app/components/DeleteButton.tsx`:

```tsx
// Before
className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors dark:text-gray-400 dark:hover:text-red-400"

// After
className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
```

- [ ] **Step 6: Update DeleteNoteButton.tsx**

Remove `dark:text-gray-400` and `dark:hover:text-red-400` from `app/components/DeleteNoteButton.tsx`:

```tsx
// Before
className="p-1.5 text-gray-400 hover:text-red-500 transition-colors dark:text-gray-400 dark:hover:text-red-400"

// After
className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
```

- [ ] **Step 7: Run build**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 8: Commit**

```bash
git add app/components/Button.tsx app/components/Card.tsx app/components/Header.tsx app/components/ConfirmModal.tsx app/components/DeleteButton.tsx app/components/DeleteNoteButton.tsx
git commit -m "refactor: remove dark: classes from components batch 1"
```

---

### Task 4: Update components (batch 2)

**Files:**
- Modify: `app/components/CopyContentButton.tsx`
- Modify: `app/components/StatusDropdown.tsx`
- Modify: `app/components/NoteSearch.tsx`
- Modify: `app/components/CommentForm.tsx`
- Modify: `app/components/CreateTicketForm.tsx`
- Modify: `app/components/TicketFilters.tsx`

**Interfaces:** None

- [ ] **Step 1: Update CopyContentButton.tsx**

Remove `dark:text-gray-400` and `dark:hover:text-green-400` from `app/components/CopyContentButton.tsx`:

```tsx
// Before
className="rounded-lg p-1.5 text-gray-400 hover:bg-green-50 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400"

// After
className="rounded-lg p-1.5 text-gray-400 hover:bg-green-50 hover:text-green-600"
```

- [ ] **Step 2: Update StatusDropdown.tsx**

Remove `dark:bg-gray-800` from `app/components/StatusDropdown.tsx`:

```tsx
// Before
className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-800"

// After
className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
```

- [ ] **Step 3: Update NoteSearch.tsx**

Remove `dark:text-gray-400` and `dark:hover:text-green-400` from `app/components/NoteSearch.tsx`:

```tsx
// Before
className="rounded-lg p-1.5 text-gray-400 hover:bg-green-50 hover:text-green-600 transition-colors dark:text-gray-400 dark:hover:text-green-400"

// After
className="rounded-lg p-1.5 text-gray-400 hover:bg-green-50 hover:text-green-600 transition-colors"
```

- [ ] **Step 4: Update CommentForm.tsx**

Remove `dark:bg-gray-900` and `dark:text-gray-100` from `app/components/CommentForm.tsx`:

```tsx
// Before
<textarea
  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-900 dark:text-gray-100"

// After
<textarea
  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
```

- [ ] **Step 5: Update CreateTicketForm.tsx**

Remove `dark:bg-gray-800`, `dark:text-gray-100`, and `dark:border-gray-700` from all input/select elements in `app/components/CreateTicketForm.tsx`:

```tsx
// Before
className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-800 dark:text-gray-100"

// After
className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
```

Also remove from select elements:

```tsx
// Before
className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-800 dark:border-gray-700"

// After
className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
```

- [ ] **Step 6: Update TicketFilters.tsx**

Remove `dark:text-gray-400` from `app/components/TicketFilters.tsx`:

```tsx
// Before
className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"

// After
className="flex items-center gap-2 text-sm text-gray-600"
```

- [ ] **Step 7: Run build**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 8: Commit**

```bash
git add app/components/CopyContentButton.tsx app/components/StatusDropdown.tsx app/components/NoteSearch.tsx app/components/CommentForm.tsx app/components/CreateTicketForm.tsx app/components/TicketFilters.tsx
git commit -m "refactor: remove dark: classes from components batch 2"
```

---

### Task 5: Update page files

**Files:**
- Modify: `app/notes/page.tsx`
- Modify: `app/tickets/page.tsx`
- Modify: `app/note/[id]/page.tsx`
- Modify: `app/repository/[id]/ticket/[ticketId]/page.tsx`
- Modify: `app/repository/[id]/ticket/[ticketId]/update/page.tsx`

**Interfaces:** None

- [ ] **Step 1: Update notes/page.tsx**

Remove `dark:text-gray-400` and `dark:border-gray-700` from `app/notes/page.tsx`:

```tsx
// Before
<p className="text-sm text-gray-500 dark:text-gray-400">
<p className="mt-1 text-sm text-gray-500 line-clamp-2 dark:text-gray-400">
<div className="flex flex-wrap gap-2 border-t border-gray-200 pt-3 dark:border-gray-700">

// After
<p className="text-sm text-gray-500">
<p className="mt-1 text-sm text-gray-500 line-clamp-2">
<div className="flex flex-wrap gap-2 border-t border-gray-200 pt-3">
```

- [ ] **Step 2: Update tickets/page.tsx**

Remove `dark:text-gray-400` from `app/tickets/page.tsx`:

```tsx
// Before
<p className="mt-1 text-sm text-gray-500 line-clamp-2 dark:text-gray-400">

// After
<p className="mt-1 text-sm text-gray-500 line-clamp-2">
```

- [ ] **Step 3: Update note/[id]/page.tsx**

Remove `dark:text-gray-400` from `app/note/[id]/page.tsx`:

```tsx
// Before
<p className="text-sm text-gray-500 dark:text-gray-400">

// After
<p className="text-sm text-gray-500">
```

- [ ] **Step 4: Update repository/[id]/ticket/[ticketId]/page.tsx**

Remove `dark:text-gray-400` and `dark:border-gray-700` from `app/repository/[id]/ticket/[ticketId]/page.tsx`:

```tsx
// Before
<div className="space-y-4 border-t border-gray-200 pt-4 dark:border-gray-700">
<p className="text-gray-700 leading-relaxed dark:text-gray-400">

// After
<div className="space-y-4 border-t border-gray-200 pt-4">
<p className="text-gray-700 leading-relaxed">
```

- [ ] **Step 5: Update repository/[id]/ticket/[ticketId]/update/page.tsx**

Remove `dark:text-gray-100` and `dark:border-gray-700` from `app/repository/[id]/ticket/[ticketId]/update/page.tsx`:

```tsx
// Before
<div className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700">
<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">

// After
<div className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
<h2 className="text-lg font-semibold text-gray-900">
```

- [ ] **Step 6: Run build**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 7: Commit**

```bash
git add app/notes/page.tsx app/tickets/page.tsx app/note/[id]/page.tsx "app/repository/[id]/ticket/[ticketId]/page.tsx" "app/repository/[id]/ticket/[ticketId]/update/page.tsx"
git commit -m "refactor: remove dark: classes from page files"
```
