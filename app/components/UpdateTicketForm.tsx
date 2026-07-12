"use client"

import { useActionState } from "react"
import { updateTicketAction } from "@/app/actions"
import { STATUSES, STATUS_LABELS } from "@/lib/constants"
import type { Ticket } from "@/lib/db"
import Button from "./Button"

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
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="ticket-title">Title</label>
      <input
        id="ticket-title"
        name="title"
        placeholder="e.g., Fix login bug"
        defaultValue={title}
        required
        className="rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
      />
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="ticket-description">Description</label>
      <textarea
        id="ticket-description"
        name="description"
        placeholder="Describe the issue (optional, markdown supported)"
        defaultValue={description}
        rows={10}
        className="rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
      />
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="ticket-status">Status</label>
      <select
        id="ticket-status"
        name="status"
        defaultValue={status}
        className="rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-black dark:focus:border-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>{STATUS_LABELS[s]}</option>
        ))}
      </select>
      {state && "error" in state && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}
      <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mt-4 flex justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  )
}
