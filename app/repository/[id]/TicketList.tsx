"use client"

import { useState } from "react"
import Link from "next/link"
import type { Ticket } from "@/lib/db"
import { STATUSES, STATUS_LABELS } from "@/lib/constants"
import Card from "@/app/components/Card"
import Badge from "@/app/components/Badge"

const FILTER_STATUSES = ["all", ...STATUSES] as const
type StatusFilter = (typeof FILTER_STATUSES)[number]
const FILTER_LABELS: Record<StatusFilter, string> = { all: "All", ...STATUS_LABELS }

export default function TicketList({
  tickets,
  repositoryId,
}: {
  tickets: Ticket[]
  repositoryId: string
}) {
  const [filter, setFilter] = useState<StatusFilter>("all")

  const filtered = filter === "all" ? tickets : tickets.filter((t) => t.status === filter)

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {FILTER_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1 text-xs font-medium cursor-pointer ${
              filter === s
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
            }`}
          >
            {FILTER_LABELS[s]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-zinc-500">
          {tickets.length === 0 ? "No tickets yet." : "No tickets match this filter."}
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {filtered.map((ticket) => (
            <li key={ticket.id}>
              <Link href={`/repository/${repositoryId}/ticket/${ticket.id}`} className="cursor-pointer hover:opacity-80">
                <Card>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{ticket.title}</span>
                    <div className="flex items-center gap-3">
                      <Badge variant={ticket.status} />
                      <span className="text-xs text-zinc-400">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
