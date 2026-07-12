"use client"

import { useActionState } from "react"
import { updateNoteAction } from "@/app/actions"
import type { Note } from "@/lib/db"

export default function UpdateNoteForm({ note }: { note: Note }) {
  const [state, action, pending] = useActionState(updateNoteAction, null)

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="noteId" value={note.id} />
      {state && "error" in state && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="title">Title</label>
      <input
        id="title"
        name="title"
        required
        defaultValue={note.title}
        placeholder="e.g., Meeting notes"
        className="rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
      />
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="content">Content</label>
      <textarea
        id="content"
        name="content"
        rows={10}
        defaultValue={note.content}
        placeholder="Write your note..."
        className="rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 resize-y whitespace-pre-wrap placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
      />
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="keywords">Keywords</label>
      <input
        id="keywords"
        name="keywords"
        defaultValue={note.keywords.join(", ")}
        placeholder="Comma separated (e.g., bug, urgent, api)"
        className="rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
      />
      <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mt-4 flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 disabled:opacity-50 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:focus-visible:outline-white"
        >
          {pending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  )
}
