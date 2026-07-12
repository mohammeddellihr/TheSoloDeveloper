# Task 1: Fix Card Spacing (notes/page.tsx)

**Files:**
- Modify: `app/notes/page.tsx`

- [ ] **Step 1: Fix header padding from pb-3 to pb-4**

In `app/notes/page.tsx`, find the line with `pb-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between` and change `pb-3` to `pb-4`:

```tsx
<div className="-mx-4 px-4 pb-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
```

- [ ] **Step 2: Fix footer spacing from pt-3 mt-3 to pt-4 mt-4**

In `app/notes/page.tsx`, find the line with `-mx-4 px-4 pt-3 mt-3 border-t border-gray-200 dark:border-gray-800 flex gap-2 flex-wrap` and change `pt-3 mt-3` to `pt-4 mt-4`:

```tsx
<div className="-mx-4 px-4 pt-4 mt-4 border-t border-gray-200 dark:border-gray-800 flex gap-2 flex-wrap">
```

- [ ] **Step 3: Verify**

Run: `& "C:\Program Files\nodejs\npm.cmd" run build`
Expected: Compiles.

Run: `& "C:\Program Files\nodejs\npm.cmd" run lint`
Expected: No errors.
