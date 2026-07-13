"use client"

import { useActionState } from "react"
import { updateNoteAction } from "@/app/actions"
import type { Note } from "@/lib/db"
import Button from "./Button"

export default function UpdateNoteForm({ note }: { note: Note }) {
  const [state, action, pending] = useActionState(updateNoteAction, null)

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="noteId" value={note.id} />
      <label className="text-sm font-medium text-gray-300" htmlFor="title">Title</label>
      <input
        id="title"
        name="title"
        defaultValue={note.title}
        placeholder="e.g., Meeting notes"
        className="rounded border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-400 focus:border-white focus:outline-none"
      />
      <label className="text-sm font-medium text-gray-300" htmlFor="content">Content</label>
      <textarea
        id="content"
        name="content"
        rows={10}
        defaultValue={note.content}
        placeholder="Write your note..."
        className="rounded border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 resize-y whitespace-pre-wrap placeholder:text-gray-400 focus:border-white focus:outline-none"
      />
      <label className="text-sm font-medium text-gray-300" htmlFor="keywords">Keywords</label>
      <input
        id="keywords"
        name="keywords"
        defaultValue={note.keywords.join(", ")}
        placeholder="Comma separated (e.g., bug, urgent, api)"
        className="rounded border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-400 focus:border-white focus:outline-none"
      />
      {state && "error" in state && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}
      <div className="-mx-4 px-4 pt-4 mt-4 border-t border-gray-800 flex justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  )
}
