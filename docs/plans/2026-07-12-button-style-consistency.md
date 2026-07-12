# Button Style Consistency Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Unify all form submit buttons to use the `<Button>` component and standardize input/select styling across every form.

**Architecture:** Extract the long primary button class string into the existing `<Button>` component. Fix CommentForm textarea/input to match other forms. Fix TicketFilters selects to match form input style. No new components, no new abstractions — just reuse what exists.

**Tech Stack:** Next.js App Router, Tailwind CSS, React

---

## Audit Findings

| # | Issue | Files | Fix |
|---|-------|-------|-----|
| 1 | Form submit buttons use raw `<button>` with inlined primary styles instead of `<Button>` component | `CommentForm.tsx`, `CreateNoteForm.tsx`, `CreateRepoForm.tsx`, `CreateTicketForm.tsx`, `UpdateNoteForm.tsx`, `UpdateRepoForm.tsx`, `UpdateTicketForm.tsx` | Replace `<button>` with `<Button>` |
| 2 | CommentForm textarea/input uses different classes than all other forms | `CommentForm.tsx:29` | Match the standard form input class |
| 3 | TicketFilters selects use unique styling, not matching form inputs | `TicketFilters.tsx:25,35` | Match the standard form input class |

**Standard form input class (from CreateNoteForm, CreateRepoForm, etc.):**
```
rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100
```

**Standard form select class (from CreateTicketForm, UpdateTicketForm):**
```
rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-black dark:focus:border-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 cursor-pointer
```

---

### Task 1: CommentForm — button + input styles

**Files:**
- Modify: `app/components/CommentForm.tsx:29,34-40`

**Step 1: Replace raw `<button>` with `<Button>`**

In `CommentForm.tsx`, add import and replace button:

```tsx
import Button from "./Button"
```

Replace the `<button>` block (lines 34-40):
```tsx
<button
  type="submit"
  disabled={pending}
  className="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 disabled:opacity-50 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:focus-visible:outline-white"
>
  {pending ? "Adding..." : "Add Comment"}
</button>
```

With:
```tsx
<Button type="submit" disabled={pending}>
  {pending ? "Adding..." : "Add Comment"}
</Button>
```

**Step 2: Fix textarea styling**

Replace the textarea className (line 29):
```
w-full rounded border border-gray-200 p-2 text-sm focus:border-black dark:focus:border-white focus:outline-none dark:border-gray-800 dark:bg-gray-900
```

With:
```
w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100
```

**Step 3: Run lint**

Run: `npm run lint`
Expected: PASS

**Step 4: Commit**

```bash
git add app/components/CommentForm.tsx
git commit -m "fix: unify CommentForm button and input styles"
```

---

### Task 2: CreateNoteForm — button

**Files:**
- Modify: `app/components/CreateNoteForm.tsx:38-44`

**Step 1: Replace raw `<button>` with `<Button>`**

Add import:
```tsx
import Button from "./Button"
```

Replace lines 38-44:
```tsx
<button
  type="submit"
  disabled={pending}
  className="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 disabled:opacity-50 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:focus-visible:outline-white"
>
  {pending ? "Creating..." : "Create Note"}
</button>
```

With:
```tsx
<Button type="submit" disabled={pending}>
  {pending ? "Creating..." : "Create Note"}
</Button>
```

**Step 2: Run lint**

Run: `npm run lint`
Expected: PASS

**Step 3: Commit**

```bash
git add app/components/CreateNoteForm.tsx
git commit -m "fix: use Button component in CreateNoteForm"
```

---

### Task 3: CreateRepoForm — button

**Files:**
- Modify: `app/components/CreateRepoForm.tsx:25-31`

**Step 1: Replace raw `<button>` with `<Button>`**

Add import:
```tsx
import Button from "./Button"
```

Replace lines 25-31:
```tsx
<button
  type="submit"
  disabled={pending}
  className="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 disabled:opacity-50 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:focus-visible:outline-white"
>
  {pending ? "Creating..." : "Create Repository"}
</button>
```

With:
```tsx
<Button type="submit" disabled={pending}>
  {pending ? "Creating..." : "Create Repository"}
</Button>
```

**Step 2: Run lint**

Run: `npm run lint`
Expected: PASS

**Step 3: Commit**

```bash
git add app/components/CreateRepoForm.tsx
git commit -m "fix: use Button component in CreateRepoForm"
```

---

### Task 4: CreateTicketForm — button

**Files:**
- Modify: `app/components/CreateTicketForm.tsx:50-56`

**Step 1: Replace raw `<button>` with `<Button>`**

Add import:
```tsx
import Button from "./Button"
```

Replace lines 50-56:
```tsx
<button
  type="submit"
  disabled={pending}
  className="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 disabled:opacity-50 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:focus-visible:outline-white"
>
  {pending ? "Creating..." : "Create Ticket"}
</button>
```

With:
```tsx
<Button type="submit" disabled={pending}>
  {pending ? "Creating..." : "Create Ticket"}
</Button>
```

**Step 2: Run lint**

Run: `npm run lint`
Expected: PASS

**Step 3: Commit**

```bash
git add app/components/CreateTicketForm.tsx
git commit -m "fix: use Button component in CreateTicketForm"
```

---

### Task 5: UpdateNoteForm — button

**Files:**
- Modify: `app/components/UpdateNoteForm.tsx:43-49`

**Step 1: Replace raw `<button>` with `<Button>`**

Add import:
```tsx
import Button from "./Button"
```

Replace lines 43-49:
```tsx
<button
  type="submit"
  disabled={pending}
  className="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 disabled:opacity-50 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:focus-visible:outline-white"
>
  {pending ? "Saving..." : "Save Changes"}
</button>
```

With:
```tsx
<Button type="submit" disabled={pending}>
  {pending ? "Saving..." : "Save Changes"}
</Button>
```

**Step 2: Run lint**

Run: `npm run lint`
Expected: PASS

**Step 3: Commit**

```bash
git add app/components/UpdateNoteForm.tsx
git commit -m "fix: use Button component in UpdateNoteForm"
```

---

### Task 6: UpdateRepoForm — button

**Files:**
- Modify: `app/components/UpdateRepoForm.tsx:33-39`

**Step 1: Replace raw `<button>` with `<Button>`**

Add import:
```tsx
import Button from "./Button"
```

Replace lines 33-39:
```tsx
<button
  type="submit"
  disabled={pending}
  className="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 disabled:opacity-50 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:focus-visible:outline-white"
>
  {pending ? "Saving..." : "Save Changes"}
</button>
```

With:
```tsx
<Button type="submit" disabled={pending}>
  {pending ? "Saving..." : "Save Changes"}
</Button>
```

**Step 2: Run lint**

Run: `npm run lint`
Expected: PASS

**Step 3: Commit**

```bash
git add app/components/UpdateRepoForm.tsx
git commit -m "fix: use Button component in UpdateRepoForm"
```

---

### Task 7: UpdateTicketForm — button

**Files:**
- Modify: `app/components/UpdateTicketForm.tsx:60-66`

**Step 1: Replace raw `<button>` with `<Button>`**

Add import:
```tsx
import Button from "./Button"
```

Replace lines 60-66:
```tsx
<button
  type="submit"
  disabled={pending}
  className="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 disabled:opacity-50 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:focus-visible:outline-white"
>
  {pending ? "Saving..." : "Save Changes"}
</button>
```

With:
```tsx
<Button type="submit" disabled={pending}>
  {pending ? "Saving..." : "Save Changes"}
</Button>
```

**Step 2: Run lint**

Run: `npm run lint`
Expected: PASS

**Step 3: Commit**

```bash
git add app/components/UpdateTicketForm.tsx
git commit -m "fix: use Button component in UpdateTicketForm"
```

---

### Task 8: TicketFilters — select styling

**Files:**
- Modify: `app/components/TicketFilters.tsx:25,35`

**Step 1: Replace select classes**

Replace both `<select>` className values from:
```
rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 cursor-pointer focus:border-black dark:focus:border-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100
```

To:
```
rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-black dark:focus:border-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 cursor-pointer
```

(Move `cursor-pointer` to end, matching the standard select class order from CreateTicketForm/UpdateTicketForm.)

**Step 2: Run lint**

Run: `npm run lint`
Expected: PASS

**Step 3: Commit**

```bash
git add app/components/TicketFilters.tsx
git commit -m "fix: align TicketFilters select styling with form inputs"
```
