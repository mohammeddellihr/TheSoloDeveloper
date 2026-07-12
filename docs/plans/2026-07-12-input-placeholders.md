# Input Placeholders Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add missing placeholders and improve weak ones across all form inputs.

**Architecture:** Direct string edits to existing component files. No new files, no logic changes.

**Tech Stack:** React, Tailwind CSS

---

## Placeholders to set

| File | Input | Placeholder |
|------|-------|-------------|
| `app/components/CreateNoteForm.tsx` | title | `e.g., Meeting notes` |
| `app/components/CreateNoteForm.tsx` | content | `Write your note...` |
| `app/components/UpdateNoteForm.tsx` | title | `e.g., Meeting notes` |
| `app/components/UpdateNoteForm.tsx` | content | `Write your note...` |
| `app/components/CreateTicketForm.tsx` | title | `e.g., Fix login bug` |
| `app/components/UpdateTicketForm.tsx` | title | `e.g., Fix login bug` |
| `app/components/UpdateTicketForm.tsx` | description | `Describe the issue (optional, markdown supported)` |

---

### Task 1: Add placeholders to CreateNoteForm

**Files:**
- Modify: `app/components/CreateNoteForm.tsx:15-27`

**Step 1: Add placeholder to title input**

Add `placeholder="e.g., Meeting notes"` to the title input (line 15-20).

**Step 2: Add placeholder to content textarea**

Add `placeholder="Write your note..."` to the content textarea (line 22-27).

**Step 3: Verify**

Run: `npm run build`
Expected: No errors

**Step 4: Commit**

```bash
git add app/components/CreateNoteForm.tsx
git commit -m "fix: add placeholders to CreateNoteForm inputs"
```

---

### Task 2: Add placeholders to UpdateNoteForm

**Files:**
- Modify: `app/components/UpdateNoteForm.tsx:17-31`

**Step 1: Add placeholder to title input**

Add `placeholder="e.g., Meeting notes"` to the title input (line 17-23).

**Step 2: Add placeholder to content textarea**

Add `placeholder="Write your note..."` to the content textarea (line 25-31).

**Step 3: Verify**

Run: `npm run build`
Expected: No errors

**Step 4: Commit**

```bash
git add app/components/UpdateNoteForm.tsx
git commit -m "fix: add placeholders to UpdateNoteForm inputs"
```

---

### Task 3: Improve placeholders in CreateTicketForm

**Files:**
- Modify: `app/components/CreateTicketForm.tsx:18-24`

**Step 1: Improve title placeholder**

Change `placeholder="Ticket title"` to `placeholder="e.g., Fix login bug"` (line 21).

**Step 2: Verify**

Run: `npm run build`
Expected: No errors

**Step 3: Commit**

```bash
git add app/components/CreateTicketForm.tsx
git commit -m "fix: improve placeholder in CreateTicketForm"
```

---

### Task 4: Improve placeholders in UpdateTicketForm

**Files:**
- Modify: `app/components/UpdateTicketForm.tsx:28-44`

**Step 1: Improve title placeholder**

Change `placeholder="Ticket title"` to `placeholder="e.g., Fix login bug"` (line 31).

**Step 2: Improve description placeholder**

Change `placeholder="Description"` to `placeholder="Describe the issue (optional, markdown supported)"` (line 40).

**Step 3: Verify**

Run: `npm run build`
Expected: No errors

**Step 4: Commit**

```bash
git add app/components/UpdateTicketForm.tsx
git commit -m "fix: improve placeholders in UpdateTicketForm"
```

---

## Summary

| File | Change |
|------|--------|
| `app/components/CreateNoteForm.tsx` | Add 2 placeholders |
| `app/components/UpdateNoteForm.tsx` | Add 2 placeholders |
| `app/components/CreateTicketForm.tsx` | Improve 1 placeholder |
| `app/components/UpdateTicketForm.tsx` | Improve 2 placeholders |
