# Dashboard Statistics Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add summary statistics to the dashboard showing total repos, total tickets, and ticket counts by status.

**Architecture:** One new DB query function returns all counts in a single object. Dashboard page renders stat cards using the existing Card component.

**Tech Stack:** Next.js App Router, better-sqlite3 (sync), Tailwind CSS, existing Card component.

---

### Task 1: Add `getStats()` to DB layer

**Files:**
- Modify: `lib/db.ts`

**Step 1: Add the function**

Add at the end of `lib/db.ts`:

```typescript
export interface Stats {
  totalRepos: number
  totalTickets: number
  pending: number
  inProgress: number
  completed: number
}

export function getStats(): Stats {
  const db = getDb()
  const totalRepos = (db.prepare('SELECT COUNT(*) as count FROM repositories').get() as { count: number }).count
  const totalTickets = (db.prepare('SELECT COUNT(*) as count FROM tickets').get() as { count: number }).count
  const pending = (db.prepare("SELECT COUNT(*) as count FROM tickets WHERE status = 'pending'").get() as { count: number }).count
  const inProgress = (db.prepare("SELECT COUNT(*) as count FROM tickets WHERE status = 'in_progress'").get() as { count: number }).count
  const completed = (db.prepare("SELECT COUNT(*) as count FROM tickets WHERE status = 'completed'").get() as { count: number }).count
  return { totalRepos, totalTickets, pending, inProgress, completed }
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds

---

### Task 2: Update dashboard page

**Files:**
- Modify: `app/page.tsx`

**Step 1: Replace dashboard content**

Replace entire `app/page.tsx` with:

```tsx
import { getStats } from "@/lib/db"
import Header from "@/app/components/Header"
import Card from "@/app/components/Card"
import Link from "next/link"

export default function Dashboard() {
  const stats = getStats()

  const statCards = [
    { label: "Repositories", value: stats.totalRepos, href: "/repositories" },
    { label: "Total Tickets", value: stats.totalTickets, href: "/tickets" },
    { label: "Pending", value: stats.pending, href: "/tickets?status=pending", color: "text-orange-600 dark:text-orange-400" },
    { label: "In Progress", value: stats.inProgress, href: "/tickets?status=in_progress", color: "text-blue-600 dark:text-blue-400" },
    { label: "Completed", value: stats.completed, href: "/tickets?status=completed", color: "text-green-600 dark:text-green-400" },
  ]

  return (
    <>
      <Header breadcrumbs={[]} title="Dashboard" />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {statCards.map((stat) => (
          <Link key={stat.label} href={stat.href} className="cursor-pointer hover:opacity-80">
            <Card>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className={`mt-1 text-2xl font-bold ${stat.color || ""}`}>{stat.value}</p>
            </Card>
          </Link>
        ))}
      </div>
    </>
  )
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Verify lint**

Run: `npm run lint`
Expected: No errors
