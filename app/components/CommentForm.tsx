"use client"

import { useActionState } from "react"
import { addCommentAction } from "@/app/actions"

export default function CommentForm({
  repoId,
  ticketId,
}: {
  repoId: string
  ticketId: string
}) {
  const [state, formAction, pending] = useActionState(addCommentAction, undefined)

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <input type="hidden" name="repoId" value={repoId} />
      <input type="hidden" name="ticketId" value={ticketId} />
      <textarea
        name="text"
        rows={3}
        placeholder="Add a comment..."
        required
        className="rounded-lg border border-zinc-200 p-2 text-sm dark:border-zinc-800 dark:bg-zinc-900"
      />
      {state?.error && <p className="text-xs text-red-500">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="self-end rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        {pending ? "Adding..." : "Add Comment"}
      </button>
    </form>
  )
}
