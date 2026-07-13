"use client"

import { useActionState } from "react"
import { addCommentAction } from "@/app/actions"
import Button from "./Button"

export default function CommentForm({
  repositoryId,
  ticketId,
}: {
  repositoryId: string
  ticketId: string
}) {
  const [state, formAction, pending] = useActionState(addCommentAction, undefined)

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="repositoryId" value={repositoryId} />
      <input type="hidden" name="ticketId" value={ticketId} />
      <div className="-mx-4 px-4 pb-4 border-b border-gray-200 dark:border-gray-800">
        <h3 className="text-sm font-semibold">Create Comment</h3>
      </div>
      <div className="pt-2">
        <textarea
          id="comment-text"
          name="text"
          rows={3}
          placeholder="Write a comment ..."
          required
          className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        />
      </div>
      {state?.error && <p className="text-xs text-red-500">{state.error}</p>}
      <div className="-mx-4 px-4 pt-4 mt-4 border-t border-gray-200 dark:border-gray-800 flex justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? "Creating..." : "Create Comment"}
        </Button>
      </div>
    </form>
  )
}
