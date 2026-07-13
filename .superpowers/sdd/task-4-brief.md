# Task 4: Fix Button Style Inconsistencies

**Files:**
- Modify: `app/repository/[id]/page.tsx`
- Modify: `app/components/Button.tsx`
- Modify: `app/components/ConfirmModal.tsx`

- [ ] **Step 1: Fix "Update Repository" button to primary**

In `app/repository/[id]/page.tsx`, find the "Update Repository" button and remove `variant="secondary"`:

```tsx
<Link href={`/repository/${repo.id}/update`}>
  <Button>Update Repository</Button>
</Link>
```

- [ ] **Step 2: Add disabled:cursor-not-allowed to Button component**

In `app/components/Button.tsx`, add `disabled:cursor-not-allowed` to the button className string, before the `${variants[variant]}` part:

```tsx
className={`rounded px-4 py-2 text-sm font-medium whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:focus-visible:outline-white disabled:cursor-not-allowed ${variants[variant]} ${className}`}
```

- [ ] **Step 3: Add disabled styles to ConfirmModal delete button**

In `app/components/ConfirmModal.tsx`, find the red delete button and add `disabled:opacity-50 disabled:cursor-not-allowed`:

```tsx
className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
```

- [ ] **Step 4: Verify**

Run: `& "C:\Program Files\nodejs\npm.cmd" run build`
Expected: Compiles.

Run: `& "C:\Program Files\nodejs\npm.cmd" run lint`
Expected: No errors.
