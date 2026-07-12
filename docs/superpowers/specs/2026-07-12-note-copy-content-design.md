# Note Copy Content Design

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:writing-plans to create the implementation plan for this spec.

**Goal:** Add a copy button to each note card in the notes list so users can copy the full note content without opening the note detail page.

**Architecture:** Create a small client component `CopyContentButton` that renders a clipboard icon and copies text to the clipboard on click. Add it to each note card in the notes list page. The existing Link wrapping the card is preserved — the copy button uses `stopPropagation` to prevent navigation.

**Tech Stack:** Next.js App Router, React, Tailwind CSS, Clipboard API

---

## Requirements

1. Each note card in the notes list (`/notes`) displays an always-visible copy icon button
2. Clicking the icon copies the full `note.content` to the clipboard
3. Clicking the icon does NOT navigate to the note detail page
4. No visual feedback after copying (silent copy)
5. The button is positioned in the top-right area of the card, next to the keywords

## Components

### CopyContentButton

- **File:** `app/components/CopyContentButton.tsx`
- **Type:** Client component (`"use client"`)
- **Props:** `{ content: string }`
- **Renders:** A button with an inline clipboard SVG icon
- **Behavior:** On click, calls `e.stopPropagation()`, `e.preventDefault()`, then `navigator.clipboard.writeText(content)`
- **Styling:** Small, subtle button — consistent with the project's dark mode support

### Notes List Page Integration

- **File:** `app/notes/page.tsx`
- **Change:** Add `CopyContentButton` import and render `<CopyContentButton content={note.content} />` inside each note card, positioned in the top-right alongside the keywords
- **Layout:** The card's flex layout already uses `justify-between` — the copy button goes in the right-side flex container with the keywords

## Files

| File | Change |
|------|--------|
| `app/components/CopyContentButton.tsx` | New client component |
| `app/notes/page.tsx` | Add import and render CopyContentButton in each card |

## Edge Cases

- Empty content: button still renders but copying empty string is harmless
- Very long content: `navigator.clipboard.writeText` handles any length
- Clipboard API unavailable (old browsers): the button renders but copy silently fails — acceptable for a solo-use tool

## Out of Scope

- Copy feedback (checkmark, toast, etc.)
- Copying title or keywords — only full content
- Keyboard shortcut for copy
