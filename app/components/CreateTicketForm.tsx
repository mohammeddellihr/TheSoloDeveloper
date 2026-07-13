"use client"

import { useActionState } from "react"
import { createTicketAction } from "@/app/actions"
import { STATUSES, STATUS_LABELS } from "@/lib/constants"
import type { Repository } from "@/lib/db"
import Button from "./Button"

export default function CreateTicketForm({
  repositories,
  defaultRepositoryId,
}: {
  repositories: Repository[]
  defaultRepositoryId?: string
}) {
  const [state, action, pending] = useActionState(createTicketAction, null)

  return (
    <form action={action} className="flex flex-col gap-3">
      <label className="text-sm font-medium text-gray-300" htmlFor="ticket-repository">Repository</label>
      <select
        id="ticket-repository"
        name="repositoryId"
        defaultValue={defaultRepositoryId ?? ""}
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
        className="rounded border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-400 focus:border-white focus:outline-none"
      />
      <label className="text-sm font-medium text-gray-300" htmlFor="ticket-content">Content</label>
      <textarea
        id="ticket-content"
        name="content"
        placeholder="Content (optional, markdown supported)"
        rows={10}
        className="rounded border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-400 focus:border-white focus:outline-none"
      />
      <label className="text-sm font-medium text-gray-300" htmlFor="ticket-status">Status</label>
      <select
        id="ticket-status"
        name="status"
        defaultValue="pending"
        className="rounded border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 focus:border-white focus:outline-none cursor-pointer"
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
      <div className="-mx-4 px-4 pt-4 mt-4 border-t border-gray-800 flex justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? "Creating..." : "Create Ticket"}
        </Button>
      </div>
    </form>
  )
}
