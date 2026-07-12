# Tickets List Like Notes List

## Goal

Redesign the tickets list page (`/tickets`) to match the visual style and layout of the notes list page (`/notes`).

## Current State

**Tickets list** (`app/tickets/page.tsx`):
- Vertical single-column list (`flex flex-col gap-2`)
- Each card shows: ticket title (linked), repo name, status badge
- No content preview

**Notes list** (`app/notes/page.tsx`):
- 3-column grid layout (`grid grid-cols-3 gap-2`)
- Each card shows: title (linked), 2-line content preview, keywords as tags
- More card-like structure with header/content/footer sections

## Proposed Changes

### 1. Grid Layout

Change the tickets list from vertical list to 3-column grid:
- Before: `<ul className="flex flex-col gap-2">`
- After: `<ul className="grid grid-cols-3 gap-2">`
- Add `className="h-full"` to both `<li>` and `<Card>` for equal height cards

### 2. Card Structure

Restructure each ticket card to match the notes card pattern:

```
┌─────────────────────────────────┐
│ Title (linked)          repo    │  ← Header section
├─────────────────────────────────┤
│ Description preview (2 lines)   │  ← Content section
│ or "No description"             │
├─────────────────────────────────┤
│ [status]                        │  ← Footer section (like keywords)
└─────────────────────────────────┘
```

**Header section:**
- Ticket title as link with `line-clamp-1` (single line, truncated with ellipsis)
- Repo name on the right side

**Content section:**
- Description text with `line-clamp-2` (2-line preview)
- Fallback: "No description" in gray italic if empty

**Footer section:**
- Status badge styled like keyword tags (rounded bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-xs font-medium)
- Separated by border-t like note keywords

### 3. No Other Changes

- Keep existing `TicketFilters` component (repo/status dropdowns)
- Keep existing pagination
- Keep existing "Create Ticket" button
- Keep search functionality via filters

## Files Modified

- `app/tickets/page.tsx` — single file change

## Data Available

The `getAllTickets()` function already returns:
- `id`, `repositoryId`, `title`, `description`, `status`, `createdAt`, `updatedAt`, `repoName`

No database or API changes needed — description field already exists in the schema.
