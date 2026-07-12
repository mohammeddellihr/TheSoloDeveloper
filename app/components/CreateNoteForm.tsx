"use client"

import { useActionState } from "react"
import { createNoteAction } from "@/app/actions"

export default function CreateNoteForm() {
  const [state, action, pending] = useActionState(createNoteAction, null)

  return (
    <form action={action} className="flex flex-col gap-3">
      {state && "error" in state && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}
      <label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
      <input
        id="title"
        name="title"
        placeholder="e.g., Meeting notes"
        required
        className="rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
      />
      <label htmlFor="content" className="text-sm font-medium text-gray-700 dark:text-gray-300">Content</label>
      <textarea
        id="content"
        name="content"
        placeholder="Write your note..."
        rows={10}
        className="rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 resize-y whitespace-pre-wrap"
      />
      <label htmlFor="keywords" className="text-sm font-medium text-gray-700 dark:text-gray-300">Keywords</label>
      <input
        id="keywords"
        name="keywords"
        placeholder="Comma separated (e.g., bug, urgent, api)"
        className="rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
      />
      <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mt-4 flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 disabled:opacity-50 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:focus-visible:outline-white"
        >
          {pending ? "Creating..." : "Create Note"}
        </button>
      </div>
    </form>
  )
}
