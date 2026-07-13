# Equal-Height Cards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make card contents stretch to equal heights across grid rows on tickets and notes pages.

**Architecture:** Add `flex flex-col` to the Card component so children can use `flex-1` to grow. Then add `flex-1` to the variable-height content areas in tickets and notes pages.

**Tech Stack:** Next.js, Tailwind CSS

## Global Constraints

- No new dependencies
- Follow existing code conventions (no comments, Tailwind classes only)
- Run `npm run lint` and `npm run build` after changes

---

### Task 1: Update Card component

**Files:**
- Modify: `app/components/Card.tsx:5`

- [ ] **Step 1: Add `flex flex-col` to Card's base classes**

```tsx
<div className={`flex flex-col rounded border border-gray-200 bg-black p-4 dark:border-gray-800 ${className || ""}`}>
```

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: No errors

- [ ] **Step 3: Run build**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add app/components/Card.tsx
git commit -m "fix: add flex layout to Card for equal-height grids"
```

---

### Task 2: Update tickets page

**Files:**
- Modify: `app/tickets/page.tsx:57`
- Modify: `app/tickets/page.tsx:61`

- [ ] **Step 1: Add `flex-1` to description paragraph**

```tsx
<p className="flex-1 pt-3 text-sm leading-relaxed whitespace-pre-wrap line-clamp-2">
```

- [ ] **Step 2: Add `flex-1` to "No description" fallback**

```tsx
<p className="flex-1 pt-3 text-sm text-gray-500 italic">No description</p>
```

- [ ] **Step 3: Run lint**

Run: `npm run lint`
Expected: No errors

- [ ] **Step 4: Run build**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 5: Commit**

```bash
git add app/tickets/page.tsx
git commit -m "fix: stretch ticket card descriptions to equal height"
```

---

### Task 3: Update notes page

**Files:**
- Modify: `app/notes/page.tsx:63`
- Modify: `app/notes/page.tsx:67`

- [ ] **Step 1: Add `flex-1` to content paragraph**

```tsx
<p className="flex-1 pt-3 text-sm leading-relaxed whitespace-pre-wrap line-clamp-2">
```

- [ ] **Step 2: Add `flex-1` to "No content" fallback**

```tsx
<p className="flex-1 pt-3 text-sm text-gray-500 italic">No content</p>
```

- [ ] **Step 3: Run lint**

Run: `npm run lint`
Expected: No errors

- [ ] **Step 4: Run build**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 5: Commit**

```bash
git add app/notes/page.tsx
git commit -m "fix: stretch note card content to equal height"
```
