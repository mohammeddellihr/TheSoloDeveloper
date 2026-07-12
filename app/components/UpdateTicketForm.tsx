"use client"

import { useActionState } from "react"
import { updateTicketAction } from "@/app/actions"
import { STATUSES, STATUS_LABELS } from "@/lib/constants"
import type { Ticket } from "@/lib/db"

export default function UpdateTicketForm({
  repositoryId,
  ticketId,
  title,
  description,
  status,
}: {
  repositoryId: string
  ticketId: string
  title: string
  description: string
  status: Ticket["status"]
}) {
  const [state, action, pending] = useActionState(updateTicketAction, null)

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="repositoryId" value={repositoryId} />
      <input type="hidden" name="ticketId" value={ticketId} />
      <label className="sr-only" htmlFor="ticket-title">Title</label>
      <input
        id="ticket-title"
        name="title"
        placeholder="Ticket title"
        defaultValue={title}
        required
        className="rounded border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
      />
      <label className="sr-only" htmlFor="ticket-description">Description</label>
      <textarea
        id="ticket-description"
        name="description"
        placeholder="Description"
        defaultValue={description}
        rows={4}
        className="rounded border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
      />
      <label className="sr-only" htmlFor="ticket-status">Status</label>
      <select
        id="ticket-status"
        name="status"
        defaultValue={status}
        className="rounded border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>{STATUS_LABELS[s]}</option>
        ))}
      </select>
      {state && "error" in state && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}
      <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 mt-4 flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 disabled:opacity-50"
        >
          {pending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  )
}
