"use client"

import { useActionState } from "react"
import { createNoteAction } from "@/app/actions"
import Button from "./Button"
import AutoResizeTextarea from "./AutoResizeTextarea"

export default function CreateNoteForm() {
  const [state, action, pending] = useActionState(createNoteAction, null)

  return (
    <form action={action} className="flex flex-col gap-3">
      <label htmlFor="title" className="text-sm font-medium text-gray-300">Title</label>
      <input
        id="title"
        name="title"
        placeholder="e.g., Meeting notes"
        className="input-field"
      />
      <label htmlFor="content" className="text-sm font-medium text-gray-300">Content</label>
      <AutoResizeTextarea
        id="content"
        name="content"
        placeholder="Write your note..."
        rows={10}
        className="rounded border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-400 focus:border-white focus:outline-none whitespace-pre-wrap"
      />
      <label htmlFor="keywords" className="text-sm font-medium text-gray-300">Keywords</label>
      <input
        id="keywords"
        name="keywords"
        placeholder="Comma separated (e.g., bug, urgent, api)"
        className="input-field"
      />
      {state && "error" in state && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}
      <div className="form-footer">
        <Button type="submit" disabled={pending}>
          {pending ? "Creating..." : "Create Note"}
        </Button>
      </div>
    </form>
  )
}
