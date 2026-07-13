### Task 2: Server Action — Add updateCommentAction()

**Files:**
- Modify: `app/actions.ts:6` (imports), add new action after line 68

**Interfaces:**
- Consumes: `updateComment()` from `lib/db.ts`
- Produces: `updateCommentAction()` server action

- [ ] **Step 1: Add updateComment to imports**

In `app/actions.ts`, add `updateComment` to the imports (line 6):

```ts
import { createRepository, createTicket, updateTicketStatus, addComment, deleteComment, updateComment, updateRepository, deleteRepository, updateTicket, deleteTicket, createNote, updateNote, deleteNote } from "@/lib/db"
```

- [ ] **Step 2: Add updateCommentAction()**

Add after the `addCommentAction` function (after line 68):

```ts
export async function updateCommentAction(_prev: unknown, formData: FormData) {
  const repositoryId = formData.get("repositoryId")
  const ticketId = formData.get("ticketId")
  const commentId = formData.get("commentId")
  const text = formData.get("text")

  if (typeof repositoryId !== "string" || typeof ticketId !== "string" || typeof commentId !== "string" || typeof text !== "string" || !text.trim()) {
    return { error: "Comment text is required" }
  }

  try {
    const comment = updateComment(commentId, text.trim())
    if (!comment) return { error: "Comment not found" }
    revalidatePath(`/repository/${repositoryId}/ticket/${ticketId}`)
    return { error: null }
  } catch {
    return { error: "Failed to update comment" }
  }
}
```

- [ ] **Step 3: Run lint to verify no errors**

Run: `npm run lint`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add app/actions.ts
git commit -m "feat: add updateCommentAction() server action"
```
