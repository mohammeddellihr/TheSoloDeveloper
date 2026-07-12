"use client"

import { useActionState } from "react"
import { createTicketAction } from "@/app/actions"

export default function CreateTicketForm({
  repoId,
  onCancel,
}: {
  repoId: string
  onCancel?: () => void
}) {
  const [state, action, pending] = useActionState(createTicketAction, null)

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="repoId" value={repoId} />
      <input
        name="title"
        placeholder="Ticket title"
        required
        className="rounded border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
      />
      <textarea
        name="description"
        placeholder="Description (optional, markdown supported)"
        rows={3}
        className="rounded border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
      />
      {state && "error" in state && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {pending ? "Creating..." : "Create Ticket"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
