"use client"

import { useState } from "react"
import Link from "next/link"
import type { Ticket } from "@/lib/db"
import { STATUSES, STATUS_LABELS, STATUS_COLORS } from "@/lib/constants"
import CreateTicketForm from "@/app/components/CreateTicketForm"

const FILTER_STATUSES = ["all", ...STATUSES] as const
type StatusFilter = (typeof FILTER_STATUSES)[number]
const FILTER_LABELS: Record<StatusFilter, string> = { all: "All", ...STATUS_LABELS }

export default function TicketList({
  tickets,
  repoId,
}: {
  tickets: Ticket[]
  repoId: string
}) {
  const [filter, setFilter] = useState<StatusFilter>("all")
  const [showForm, setShowForm] = useState(false)

  const filtered = filter === "all" ? tickets : tickets.filter((t) => t.status === filter)

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {FILTER_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              filter === s
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
            }`}
          >
            {FILTER_LABELS[s]}
          </button>
        ))}
        <div className="ml-auto">
          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
          >
            {showForm ? "Cancel" : "New Ticket"}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mt-4 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
          <CreateTicketForm repoId={repoId} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-zinc-500">
          {tickets.length === 0 ? "No tickets yet. Create one above." : "No tickets match this filter."}
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {filtered.map((ticket) => {
            const colors = STATUS_COLORS[ticket.status]
            return (
              <li key={ticket.id}>
                <Link
                  href={`/repository/${repoId}/ticket/${ticket.id}`}
                  className="flex items-center justify-between rounded-lg border border-zinc-200 p-4 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
                >
                  <span className="font-medium">{ticket.title}</span>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}>
                      {STATUS_LABELS[ticket.status]}
                    </span>
                    <span className="text-xs text-zinc-400">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}
