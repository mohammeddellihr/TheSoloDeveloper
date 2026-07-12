"use client"

import { useActionState } from "react"
import { createTicketAction } from "@/app/actions"
import { STATUSES, STATUS_LABELS } from "@/lib/constants"

export default function CreateTicketForm({
  repositoryId,
}: {
  repositoryId: string
}) {
  const [state, action, pending] = useActionState(createTicketAction, null)

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="repositoryId" value={repositoryId} />
      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300" htmlFor="ticket-title">Title</label>
      <input
        id="ticket-title"
        name="title"
        placeholder="Ticket title"
        required
        className="rounded border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-black dark:focus:border-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
      />
      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300" htmlFor="ticket-description">Description</label>
      <textarea
        id="ticket-description"
        name="description"
        placeholder="Description (optional, markdown supported)"
        rows={3}
        className="rounded border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-black dark:focus:border-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
      />
      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300" htmlFor="ticket-status">Status</label>
      <select
        id="ticket-status"
        name="status"
        defaultValue="pending"
        className="rounded border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-black dark:focus:border-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 cursor-pointer"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABELS[s]}
          </option>
        ))}
      </select>
      {state && "error" in state && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}
      <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 mt-4 flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 disabled:opacity-50 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:focus-visible:outline-white"
        >
          {pending ? "Creating..." : "Create Ticket"}
        </button>
      </div>
    </form>
  )
}
