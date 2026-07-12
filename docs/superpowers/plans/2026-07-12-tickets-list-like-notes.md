# Tickets List Like Notes List Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the tickets list page to match the notes list visual style with 3-column grid, description preview, and status tag footer.

**Architecture:** Single file change to `app/tickets/page.tsx` — restructure the card layout from vertical list to 3-column grid with header/content/footer sections matching the notes pattern.

**Tech Stack:** Next.js App Router, React, Tailwind CSS

## Global Constraints

- No test suite exists — verify changes visually via `npm run dev`
- DB is sync — `better-sqlite3` functions are synchronous
- Server Actions remain async (Next.js requirement)
- Single file modification: `app/tickets/page.tsx`

---

### Task 1: Restructure tickets list layout

**Files:**
- Modify: `app/tickets/page.tsx`

**Interfaces:**
- Consumes: `getAllTickets()` returns `(Omit<Ticket, "comments"> & { repoName: string })[]`
- Produces: Updated JSX with grid layout and restructured cards

- [ ] **Step 1: Update the `<ul>` grid class**

Change line 47 from:
```jsx
<ul className="flex flex-col gap-2">
```
To:
```jsx
<ul className="grid grid-cols-3 gap-2">
```

- [ ] **Step 2: Add h-full to `<li>` and `<Card>`**

Change line 49 from:
```jsx
<li key={ticket.id}>
  <Card>
```
To:
```jsx
<li key={ticket.id} className="h-full">
  <Card className="h-full">
```

- [ ] **Step 3: Restructure card header with line-clamp**

Replace lines 51-57 (the flex items-center justify-between div) with:
```jsx
<div className="-mx-4 px-4 pb-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
  <Link href={`/repository/${ticket.repositoryId}/ticket/${ticket.id}`} className="font-medium hover:underline cursor-pointer line-clamp-1">
    {ticket.title}
  </Link>
  <span className="text-sm text-gray-500 line-clamp-1">{ticket.repoName}</span>
</div>
```

- [ ] **Step 4: Add description preview section**

After the header div, add:
```jsx
{ticket.description ? (
  <p className="pt-3 text-sm leading-relaxed whitespace-pre-wrap line-clamp-2">
    {ticket.description}
  </p>
) : (
  <p className="pt-3 text-sm text-gray-500 italic">No description</p>
)}
```

- [ ] **Step 5: Add status footer section**

After the description, add:
```jsx
<div className="-mx-4 px-4 pt-3 mt-3 border-t border-gray-200 dark:border-gray-800 flex gap-2">
  <Badge variant={ticket.status} />
</div>
```

- [ ] **Step 6: Remove old status badge location**

Remove the old `<div className="flex items-center gap-2"><Badge variant={ticket.status} /></div>` that was in the header.

- [ ] **Step 7: Verify the build passes**

Run: `npm run build`
Expected: Build succeeds with no TypeScript errors

- [ ] **Step 8: Commit**

```bash
git add app/tickets/page.tsx
git commit -m "feat: redesign tickets list to match notes grid layout"
```
