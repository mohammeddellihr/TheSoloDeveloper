# Task 5: Fix Text Styling and Dark Mode

**Files:**
- Modify: `app/repository/[id]/ticket/[ticketId]/page.tsx`
- Modify: `app/page.tsx`
- Modify: `app/repositories/page.tsx`
- Modify: `app/repository/[id]/TicketList.tsx`
- Modify: `app/tickets/page.tsx`
- Modify: `app/notes/page.tsx`
- Modify: `app/repository/[id]/page.tsx`
- Modify: `app/note/[id]/page.tsx`

- [ ] **Step 1: Add leading-relaxed to comment text**

In `app/repository/[id]/ticket/[ticketId]/page.tsx`, find the comment text `<p>` and add `leading-relaxed`:

```tsx
<p className="text-sm leading-relaxed whitespace-pre-wrap">{comment.text}</p>
```

- [ ] **Step 2: Fix dashboard stat label dark mode**

In `app/page.tsx`, find the stat label `<p>` and add `dark:text-gray-400`:

```tsx
<p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
```

- [ ] **Step 3: Add dark:text-gray-400 to all empty state text**

Add `dark:text-gray-400` to the empty state `<p>` in these files:
- `app/repositories/page.tsx` — "No repositories yet."
- `app/repository/[id]/TicketList.tsx` — "No tickets found." / "No tickets match this filter."
- `app/tickets/page.tsx` — "No tickets found."
- `app/notes/page.tsx` — "No notes found."
- `app/repository/[id]/page.tsx` — "No content" (italic)
- `app/repository/[id]/ticket/[ticketId]/page.tsx` — "No content" (italic)
- `app/note/[id]/page.tsx` — "No content" (italic)

For each, change `text-gray-500` to `text-gray-500 dark:text-gray-400`.

- [ ] **Step 4: Add dark:text-gray-400 to "in {repoName}" text**

In `app/tickets/page.tsx`, find the "in {ticket.repoName}" span and add `dark:text-gray-400`:

```tsx
<span className="text-sm text-gray-500 dark:text-gray-400">in {ticket.repoName}</span>
```

- [ ] **Step 5: Verify**

Run: `& "C:\Program Files\nodejs\npm.cmd" run build`
Expected: Compiles.

Run: `& "C:\Program Files\nodejs\npm.cmd" run lint`
Expected: No errors.
