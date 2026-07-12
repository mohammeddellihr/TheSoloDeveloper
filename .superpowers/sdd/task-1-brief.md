# Task 1: Add deleteComment to lib/db.ts

**Files:**
- Modify: `lib/db.ts`

**Interfaces:**
- Consumes: nothing (standalone)
- Produces: `deleteComment(commentId: string): boolean`

- [ ] **Step 1: Add the deleteComment function**

Add to the end of `lib/db.ts` (before the closing of the file):

```ts
export function deleteComment(commentId: string): boolean {
  const result = getDb().prepare('DELETE FROM comments WHERE id = ?').run(commentId)
  return result.changes > 0
}
```

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: Compiles. The function is exported and available.

Run: `npm run lint`
Expected: No errors.
