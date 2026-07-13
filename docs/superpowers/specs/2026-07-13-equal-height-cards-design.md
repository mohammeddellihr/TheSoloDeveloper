# Equal-Height Cards in Grid Layouts

## Problem

Cards in grid layouts (tickets, notes pages) have unequal heights when content varies. For example, a ticket with a 1-line description renders shorter than one with a 2-line description, even though CSS Grid makes the row itself equal height. The Card component's inner content doesn't stretch to fill available space.

## Solution

Three small CSS changes across three files:

### 1. Card component — `app/components/Card.tsx`

Add `flex flex-col` to the Card's base classes. This makes the Card a flex column container so children can use `flex-1` to grow vertically.

**Current:**
```tsx
<div className={`rounded border border-gray-200 bg-black p-4 dark:border-gray-800 ${className || ""}`}>
```

**After:**
```tsx
<div className={`flex flex-col rounded border border-gray-200 bg-black p-4 dark:border-gray-800 ${className || ""}`}>
```

### 2. Tickets page — `app/tickets/page.tsx`

Add `flex-1` to the description `<p>` element so it stretches to fill remaining card height.

**Current (line 57):**
```tsx
<p className="pt-3 text-sm leading-relaxed whitespace-pre-wrap line-clamp-2">
```

**After:**
```tsx
<p className="flex-1 pt-3 text-sm leading-relaxed whitespace-pre-wrap line-clamp-2">
```

Also add `flex-1` to the "No description" fallback (line 61):
```tsx
<p className="flex-1 pt-3 text-sm text-gray-500 italic">No description</p>
```

### 3. Notes page — `app/notes/page.tsx`

Same pattern — add `flex-1` to the content `<p>` element.

**Current (line 63):**
```tsx
<p className="pt-3 text-sm leading-relaxed whitespace-pre-wrap line-clamp-2">
```

**After:**
```tsx
<p className="flex-1 pt-3 text-sm leading-relaxed whitespace-pre-wrap line-clamp-2">
```

Also add `flex-1` to the "No content" fallback (line 67):
```tsx
<p className="flex-1 pt-3 text-sm text-gray-500 italic">No content</p>
```

## Scope

- **In scope:** Tickets page, notes page, Card component
- **Out of scope:** Repositories page (no variable-height content), dashboard page (different grid structure with stat cards)

## Impact

Minimal and non-breaking:
- Cards used outside grids (e.g., "No tickets found" empty state) are unaffected — flexbox with a single child behaves like block layout
- All future grid layouts using Card automatically benefit from equal-height support
- No visual change to existing single-card usage

## Verification

- Run `npm run build` to confirm no TypeScript errors
- Run `npm run lint` to confirm no lint errors
- Manual check: cards in tickets/notes grids should have equal heights within each row
