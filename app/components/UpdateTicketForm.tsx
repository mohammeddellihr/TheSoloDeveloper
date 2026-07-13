"use client"

import { useActionState } from "react"
import { updateTicketAction } from "@/app/actions"
import { STATUSES, STATUS_LABELS } from "@/lib/constants"
import type { Repository, Ticket } from "@/lib/db"
import Button from "./Button"

export default function UpdateTicketForm({
  repositoryId,
  ticketId,
  title,
  content,
  status,
  repositories,
}: {
  repositoryId: string
  ticketId: string
  title: string
  content: string
  status: Ticket["status"]
  repositories: Repository[]
}) {
  const [state, action, pending] = useActionState(updateTicketAction, null)

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="ticketId" value={ticketId} />
      <label className="text-sm font-medium text-gray-300" htmlFor="ticket-repository">Repository</label>
      <select
        id="ticket-repository"
        name="repositoryId"
        defaultValue={repositoryId}
        required
        className="rounded border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 focus:border-white focus:outline-none cursor-pointer"
      >
        <option value="" disabled>Select a repository</option>
        {repositories.map((repository) => (
          <option key={repository.id} value={repository.id}>
            {repository.name}
          </option>
        ))}
      </select>
      <label className="text-sm font-medium text-gray-300" htmlFor="ticket-title">Title</label>
      <input
        id="ticket-title"
        name="title"
        placeholder="e.g., Fix login bug"
        defaultValue={title}
        className="rounded border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-400 focus:border-white focus:outline-none"
      />
      <label className="text-sm font-medium text-gray-300" htmlFor="ticket-content">Content</label>
      <textarea
        id="ticket-content"
        name="content"
        placeholder="Describe the issue (optional, markdown supported)"
        defaultValue={content}
        rows={10}
        className="rounded border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-400 focus:border-white focus:outline-none"
      />
      <label className="text-sm font-medium text-gray-300" htmlFor="ticket-status">Status</label>
      <select
        id="ticket-status"
        name="status"
        defaultValue={status}
        className="rounded border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 focus:border-white focus:outline-none cursor-pointer"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>{STATUS_LABELS[s]}</option>
        ))}
      </select>
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
