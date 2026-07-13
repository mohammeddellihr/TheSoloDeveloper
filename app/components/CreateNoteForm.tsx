"use client"

import { useActionState } from "react"
import { createNoteAction } from "@/app/actions"
import Button from "./Button"

export default function CreateNoteForm() {
  const [state, action, pending] = useActionState(createNoteAction, null)

  return (
    <form action={action} className="flex flex-col gap-3">
      <label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
      <input
        id="title"
        name="title"
        placeholder="e.g., Meeting notes"
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
      {state && "error" in state && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}
      <div className="-mx-4 px-4 pt-4 mt-4 border-t border-gray-200 dark:border-gray-800 flex justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? "Creating..." : "Create Note"}
        </Button>
      </div>
    </form>
  )
}
