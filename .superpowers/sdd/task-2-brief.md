# Task 2: Add deleteCommentAction to app/actions.ts

**Files:**
- Modify: `app/actions.ts`

**Interfaces:**
- Consumes: `deleteComment` from `@/lib/db`
- Produces: `deleteCommentAction(repositoryId: string, ticketId: string, commentId: string)`

- [ ] **Step 1: Add the server action**

Add to the end of `app/actions.ts` (before the closing of the file):

```ts
export async function deleteCommentAction(_prev: unknown, formData: FormData) {
  const repositoryId = formData.get("repositoryId")
  const ticketId = formData.get("ticketId")
  const commentId = formData.get("commentId")

  if (typeof repositoryId !== "string" || typeof ticketId !== "string" || typeof commentId !== "string") {
    return { error: "Invalid request" }
  }

  try {
    deleteComment(commentId)
    revalidatePath(`/repository/${repositoryId}/ticket/${ticketId}`)
    return { error: null }
  } catch {
    return { error: "Failed to delete comment" }
  }
}
```

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: Compiles. The action is exported and available.

Run: `npm run lint`
Expected: No errors.
