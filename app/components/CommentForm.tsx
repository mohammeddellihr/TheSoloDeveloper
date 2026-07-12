"use client"

import { useActionState } from "react"
import { addCommentAction } from "@/app/actions"

export default function CommentForm({
  repositoryId,
  ticketId,
}: {
  repositoryId: string
  ticketId: string
}) {
  const [state, formAction, pending] = useActionState(addCommentAction, undefined)

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <input type="hidden" name="repositoryId" value={repositoryId} />
      <input type="hidden" name="ticketId" value={ticketId} />
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <h3 className="text-sm font-semibold">Comment</h3>
      </div>
      <div className="pt-2">
        <textarea
          id="comment-text"
          name="text"
          rows={3}
          placeholder="Add a comment..."
          required
          className="w-full rounded-lg border border-zinc-200 p-2 text-sm focus:border-black dark:focus:border-white focus:outline-none dark:border-zinc-800 dark:bg-zinc-900"
        />
      </div>
      {state?.error && <p className="text-xs text-red-500">{state.error}</p>}
      <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 mt-2 flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 disabled:opacity-50 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:focus-visible:outline-white"
        >
          {pending ? "Adding..." : "Add Comment"}
        </button>
      </div>
    </form>
  )
}
