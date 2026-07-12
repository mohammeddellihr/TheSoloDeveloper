# Task 4: Add "Create Ticket" button to the Tickets list header

**Files:**
- Modify: `app/tickets/page.tsx`

**Step 1: Add the button alongside TicketFilters**

Change the Header `actions` from:

```tsx
actions={<TicketFilters repositories={repositories} />}
```

to:

```tsx
actions={
  <div className="flex items-center gap-2">
    <TicketFilters repositories={repositories} />
    <Link href="/tickets/create">
      <Button>Create Ticket</Button>
    </Link>
  </div>
}
```

Add the `Link` and `Button` imports if not already present (they are both currently imported in this file: `Link` at line 1, `Button` is NOT imported yet — add `import Button from "../components/Button"`).

**Step 2: Verify**

Run: `npm run build`
Expected: Compiles. `app/tickets/page.tsx` now shows the filter + Create Ticket button in the header.

Run: `npm run lint`
Expected: No errors.
