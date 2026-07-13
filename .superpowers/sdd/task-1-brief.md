### Task 1: Database Layer — Add updatedAt and updateComment()

**Files:**
- Modify: `lib/db.ts:31-36` (schema), `lib/db.ts:54-58` (Comment interface), add new function

**Interfaces:**
- Consumes: None (standalone database layer)
- Produces: `updateComment(commentId: string, text: string): Comment | null`

- [ ] **Step 1: Add updatedAt column to comments table schema**

In `lib/db.ts`, modify the comments table creation (lines 31-36):

```sql
CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  ticketId TEXT NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT
);
```

- [ ] **Step 2: Add migration for existing databases**

After the existing migration code (line 50), add:

```ts
// ponytail: migration for comments updatedAt column
const commentColumns = _db.prepare("PRAGMA table_info(comments)").all() as { name: string }[]
if (!commentColumns.some(c => c.name === "updatedAt")) {
  _db.exec("ALTER TABLE comments ADD COLUMN updatedAt TEXT")
}
```

- [ ] **Step 3: Update Comment interface**

Replace the Comment interface (lines 54-58):

```ts
export interface Comment {
  id: string
  text: string
  createdAt: string
  updatedAt: string | null
}
```

- [ ] **Step 4: Add updateComment() function**

Add after the `deleteComment` function (after line 269):

```ts
export function updateComment(commentId: string, text: string): Comment | null {
  const db = getDb()
  const now = iso()
  const result = db.prepare('UPDATE comments SET text = ?, updatedAt = ? WHERE id = ?').run(text, now, commentId)
  if (result.changes === 0) return null
  return db.prepare('SELECT * FROM comments WHERE id = ?').get(commentId) as Comment
}
```

- [ ] **Step 5: Update getTickets() to include updatedAt**

Modify the `getTickets` function (lines 118-138) to include `updatedAt` in the comment parsing:

```ts
export function getTickets(repositoryId: string): Ticket[] {
  const db = getDb()
  const rows = db.prepare(`
    SELECT t.*, GROUP_CONCAT(c.id || '::' || c.text || '::' || c.createdAt || '::' || COALESCE(c.updatedAt, '')) as commentData
    FROM tickets t
    LEFT JOIN comments c ON c.ticketId = t.id
    WHERE t.repositoryId = ?
    GROUP BY t.id
    ORDER BY t.createdAt DESC
  `).all(repositoryId) as (Omit<Ticket, 'comments'> & { commentData: string | null })[]

  return rows.map(row => ({
    ...row,
    comments: row.commentData
      ? row.commentData.split(',').map(raw => {
          const [id, text, createdAt, updatedAt] = raw.split('::')
          return { id, text, createdAt, updatedAt: updatedAt || null }
        })
      : [],
  }))
}
```

- [ ] **Step 6: Update getTicket() to include updatedAt**

The `getTicket` function (lines 140-146) already uses `SELECT *` for comments, so it will automatically include the new `updatedAt` column. No changes needed.

- [ ] **Step 7: Run lint to verify no errors**

Run: `npm run lint`
Expected: PASS

- [ ] **Step 8: Commit**

```bash
git add lib/db.ts
git commit -m "feat: add updatedAt to comments and updateComment() function"
```
