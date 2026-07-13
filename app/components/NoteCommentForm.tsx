"use client"

import { useActionState } from "react"
import { addNoteCommentAction } from "@/app/actions"
import Button from "./Button"
import AutoResizeTextarea from "./AutoResizeTextarea"

export default function NoteCommentForm({
  noteId,
}: {
  noteId: string
}) {
  const [state, formAction, pending] = useActionState(addNoteCommentAction, undefined)

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="noteId" value={noteId} />
      <div className="-mx-4 px-4 pb-4 border-b border-gray-800">
        <h3 className="text-sm font-semibold">Create Comment</h3>
      </div>
      <div className="pt-2">
        <AutoResizeTextarea
          id="note-comment-text"
          name="text"
          rows={5}
          placeholder="Write a comment ..."
          required
          className="w-full rounded border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-400 focus:border-white focus:outline-none"
        />
      </div>
      {state?.error && <p className="text-xs text-red-500">{state.error}</p>}
      <div className="form-footer">
        <Button type="submit" disabled={pending}>
          {pending ? "Creating..." : "Create Comment"}
        </Button>
      </div>
    </form>
  )
}
