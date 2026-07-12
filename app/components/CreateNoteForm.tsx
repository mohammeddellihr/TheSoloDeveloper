"use client"

import { useActionState } from "react"
import { createNoteAction } from "@/app/actions"
import Button from "./Button"
import Card from "./Card"

export default function CreateNoteForm() {
  const [state, action, pending] = useActionState(createNoteAction, null)

  return (
    <form action={action}>
      <Card>
        <Card className="border-b p-6">
          <h2 className="text-lg font-bold">Create Note</h2>
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
              className="rounded border px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="content" className="text-sm font-medium">Content</label>
            <textarea
              id="content"
              name="content"
              rows={10}
              className="rounded border px-3 py-2 text-sm resize-y whitespace-pre-wrap"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="keywords" className="text-sm font-medium">Keywords</label>
            <input
              id="keywords"
              name="keywords"
              placeholder="Comma separated (e.g., bug, urgent, api)"
              className="rounded border px-3 py-2 text-sm"
            />
          </div>
        </Card>
        <Card className="border-t p-6 flex items-center justify-between">
          <Button type="button" variant="secondary" onClick={() => history.back()}>Cancel</Button>
          <Button type="submit" disabled={pending}>Create Note</Button>
        </Card>
      </Card>
    </form>
  )
}
