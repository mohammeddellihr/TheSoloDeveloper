# Add Archived Status Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add "Archived" as a new ticket status option.

**Architecture:** Add 'archived' to the Ticket status union type, update the status constants, and add the gray color for archived status.

**Tech Stack:** TypeScript, Tailwind CSS 4

## Global Constraints

- No test suite — verification via `npm run build` + `npm run lint`
- No git commits — all git commands are skipped
- Solo use, no auth
- Node.js path: `& "C:\Program Files\nodejs\npm.cmd" run build`

---

### Task 1: Add Archived Status

**Files:**
- Modify: `lib/db.ts`
- Modify: `lib/constants.ts`

**Interfaces:**
- Consumes: nothing
- Produces: `Ticket["status"]` now includes `'archived'`

- [ ] **Step 1: Update Ticket type in db.ts**

In `lib/db.ts`, find all 3 occurrences of the status type union and add `'archived'`:

Line 65 (Ticket type):
```ts
status: 'pending' | 'in_progress' | 'completed' | 'archived'
```

Line 159 (updateTicketStatus function):
```ts
status: 'pending' | 'in_progress' | 'completed' | 'archived'
```

Line 197 (updateTicket function):
```ts
status: 'pending' | 'in_progress' | 'completed' | 'archived'
```

- [ ] **Step 2: Update constants.ts**

Replace the entire contents of `lib/constants.ts`:

```ts
import type { Ticket } from "@/lib/db"

export const STATUS_LABELS: Record<Ticket["status"], string> = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
  archived: "Archived",
}

export const STATUS_COLORS: Record<Ticket["status"], { bg: string; text: string }> = {
  pending: { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-300" },
  in_progress: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-300" },
  completed: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-300" },
  archived: { bg: "bg-gray-100 dark:bg-gray-900/30", text: "text-gray-700 dark:text-gray-300" },
}

export const STATUSES: Ticket["status"][] = ["pending", "in_progress", "completed", "archived"]
```

- [ ] **Step 3: Verify**

Run: `& "C:\Program Files\nodejs\npm.cmd" run build`
Expected: Compiles. The "Archived" status is now available in the StatusDropdown on ticket update pages.

Run: `& "C:\Program Files\nodejs\npm.cmd" run lint`
Expected: No errors.

---

## Summary of Changes

| File | Change |
|------|--------|
| `lib/db.ts` | Add `'archived'` to status union type (3 places) |
| `lib/constants.ts` | Add archived to STATUS_LABELS, STATUS_COLORS, STATUSES |
