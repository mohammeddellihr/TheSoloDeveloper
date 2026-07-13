# Note Copy Content Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a copy button to each note card in the notes list so users can copy the full note content without opening the note detail page.

**Architecture:** Create a client component `CopyContentButton` that renders a clipboard icon and copies text to the clipboard on click. Add it to each note card in the notes list page. The existing Link wrapping the card is preserved — the copy button uses `stopPropagation` to prevent navigation.

**Tech Stack:** Next.js App Router, React, Tailwind CSS, Clipboard API

## Global Constraints

- No test suite — verification is `npm run build` + `npm run lint`
- Follow existing component patterns (see `app/components/Badge.tsx` for style reference)
- No comments in code unless asked
- Solo use, no auth
- No icon library — use inline SVG

---

### Task 1: Add CopyContentButton to note cards

**Files:**
- Create: `app/components/CopyContentButton.tsx`
- Modify: `app/notes/page.tsx`

**Interfaces:**
- Consumes: `Note` type from `@/lib/db` (has `content: string`)
- Produces: `CopyContentButton` component — renders a clipboard icon button that copies content on click

- [ ] **Step 1: Create the CopyContentButton component**

Create `app/components/CopyContentButton.tsx`:

```tsx
"use client"

export default function CopyContentButton({ content }: { content: string }) {
  function handleClick(e: React.MouseEvent) {
    e.stopPropagation()
    e.preventDefault()
    navigator.clipboard.writeText(content)
  }

  return (
    <button
      onClick={handleClick}
      className="rounded p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
      aria-label="Copy content"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
      >
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
      </svg>
    </button>
  )
}
```

- [ ] **Step 2: Add CopyContentButton to the notes list page**

Modify `app/notes/page.tsx`. Add the import at the top:

```tsx
import CopyContentButton from "@/app/components/CopyContentButton"
```

Change the card content from:

```tsx
<div className="flex items-center justify-between">
  <div className="flex items-center gap-2">
    <span className="font-medium">{note.title}</span>
  </div>
  <div className="flex items-center gap-2">
    {note.keywords.length > 0 && (
      <div className="flex gap-2 flex-wrap">
        {note.keywords.map((keyword) => (
          <span key={keyword} className="inline-flex items-center rounded bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-300">
            {keyword}
          </span>
        ))}
      </div>
    )}
  </div>
</div>
```

to:

```tsx
<div className="flex items-center justify-between">
  <div className="flex items-center gap-2">
    <span className="font-medium">{note.title}</span>
  </div>
  <div className="flex items-center gap-2">
    {note.keywords.length > 0 && (
      <div className="flex gap-2 flex-wrap">
        {note.keywords.map((keyword) => (
          <span key={keyword} className="inline-flex items-center rounded bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-300">
            {keyword}
          </span>
        ))}
      </div>
    )}
    <CopyContentButton content={note.content} />
  </div>
</div>
```

- [ ] **Step 3: Verify**

Run: `npm run build`
Expected: Compiles. Notes list shows a copy icon on each card.

Run: `npm run lint`
Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add app/components/CopyContentButton.tsx app/notes/page.tsx
git commit -m "feat: add copy content button to note cards"
```

---

## Summary of changes

| File | Change |
|------|--------|
| `app/components/CopyContentButton.tsx` | New client component — clipboard icon, copies content on click |
| `app/notes/page.tsx` | Added import and render CopyContentButton in each card |
