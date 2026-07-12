# Design System

## Layout

- **Max width:** `max-w-5xl`, centered with `mx-auto`, padded `px-6`.
- **Main content:** `flex flex-col gap-6 py-12` inside `<main>`.
- **Nav bar:** `bg-gray-50 dark:bg-gray-900`, border bottom, `max-w-5xl` centered, `py-3`.
- **Font:** Josefin Sans via `--font-josefin-sans` CSS variable.

## Components

### Card
Rounded border container. Default: `rounded border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900`.
Override padding/extra classes via `className` prop.

### Button
`rounded px-4 py-2 text-sm font-medium cursor-pointer`.
- **primary:** `bg-black text-white hover:bg-gray-800` (dark: inverted).
- **secondary:** `bg-white text-black border border-gray-300 hover:bg-gray-100` (dark: inverted).
- Both: `disabled:opacity-50`, `focus-visible:outline-2 focus-visible:outline-offset-2`.

### Badge
Status pill: `rounded px-2.5 py-0.5 text-xs font-medium`. Colors from `STATUS_COLORS` in `lib/constants.ts`.
- pending: orange, in_progress: blue, completed: green.

### Header
Page header with breadcrumbs + title + optional actions slot.
- Breadcrumbs: `text-sm text-gray-400`, links `hover:text-gray-600 dark:hover:text-gray-300`.
- Title: `text-2xl font-bold tracking-tight`.
- Actions aligned right with `flex items-center gap-2`.
- Spacing: `mb-6 space-y-1`.

### StatusDropdown
Select styled as a Badge pill, auto-submits on change via `requestSubmit()`.

### Forms
Vertical layout: `flex flex-col gap-3`.
- Labels: `text-sm font-medium text-gray-700 dark:text-gray-300`.
- Inputs: `rounded border border-gray-300 bg-white px-3 py-2 text-sm ... dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100`.
- Submit row: `border-t border-gray-200 dark:border-gray-800 pt-4 mt-4 flex justify-end`.
- Error text: `text-sm text-red-500`.

## Patterns

### Empty states
```tsx
<Card>
  <p className="text-center text-sm text-gray-500 dark:text-gray-400">No {thing} found.</p>
</Card>
```
Always centered text, always Card wrapper. No buttons or extra padding.

### List pages
Same structure on `/repositories`, `/tickets`, `/notes`:
1. `<Header>` with breadcrumbs, title, actions.
2. Empty state `<Card>` when list is empty.
3. `<ul className="flex flex-col gap-2">` with `<li>` items wrapped in `<Link>` + `<Card>`.

### List items (ticket/repo)
Use `<Card>` inside a `<Link>` with `cursor-pointer hover:opacity-80`.
Tickets show title + Badge + optional metadata inline with `flex items-center justify-between`.

### Dark mode
All components support dark mode via `dark:` prefix classes. Always pair light/dark variants.

### Server vs Client
- Pages: server components, fetch data directly.
- Forms + interactive widgets: `"use client"` with `useActionState` for server actions.
