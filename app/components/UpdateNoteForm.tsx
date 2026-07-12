"use client"

import { useActionState } from "react"
import { updateNoteAction } from "@/app/actions"
import Button from "./Button"
import Card from "./Card"
import type { Note } from "@/lib/db"

export default function UpdateNoteForm({ note }: { note: Note }) {
  const [state, action, pending] = useActionState(updateNoteAction, null)

  return (
    <form action={action}>
      <input type="hidden" name="noteId" value={note.id} />
      <Card>
        <Card className="border-b p-6">
          <h2 className="text-lg font-bold">Update Note</h2>
        </Card>
        <Card className="p-6 flex flex-col gap-6">
          {state?.error && (
            <p className="text-sm text-red-500">{state.error}</p>
          )}
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="text-sm font-medium">Title</label>
            <input
              id="title"
              name="title"
              required
              defaultValue={note.title}
              className="rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="content" className="text-sm font-medium">Content</label>
            <textarea
              id="content"
              name="content"
              rows={10}
              defaultValue={note.content}
              className="rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 resize-y whitespace-pre-wrap dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="keywords" className="text-sm font-medium">Keywords</label>
            <input
              id="keywords"
              name="keywords"
              defaultValue={note.keywords.join(", ")}
              placeholder="Comma separated (e.g., bug, urgent, api)"
              className="rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            />
          </div>
        </Card>
        <Card className="border-t p-6 flex items-center justify-between">
          <Button type="button" variant="secondary" onClick={() => history.back()}>Cancel</Button>
          <div className="flex gap-2">
            <Button type="submit" disabled={pending}>Update Note</Button>
          </div>
        </Card>
      </Card>
    </form>
  )
}
