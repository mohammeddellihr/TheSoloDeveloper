# Task 2: Fix Form Layout Inconsistencies

**Files:**
- Modify: `app/components/CommentForm.tsx`
- Modify: `app/components/CreateNoteForm.tsx`
- Modify: `app/components/UpdateNoteForm.tsx`

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

In `app/components/CreateNoteForm.tsx`, move the error message from the top (just after `<form>`) to just before the submit footer `<div className="-mx-4 px-4 pt-4...`. The final order should be: fields, error, submit button.

Read the file first, then move the `{state?.error && ...}` block from after `<form>` to before the submit `<div>`.

- [ ] **Step 4: Fix UpdateNoteForm error placement**

In `app/components/UpdateNoteForm.tsx`, move the error message from the top (just after `<form>`) to just before the submit footer `<div className="-mx-4 px-4 pt-4...`. The final order should be: fields, error, submit button.

Read the file first, then move the `{state?.error && ...}` block from after `<form>` to before the submit `<div>`.

- [ ] **Step 5: Verify**

Run: `& "C:\Program Files\nodejs\npm.cmd" run build`
Expected: Compiles.

Run: `& "C:\Program Files\nodejs\npm.cmd" run lint`
Expected: No errors.
