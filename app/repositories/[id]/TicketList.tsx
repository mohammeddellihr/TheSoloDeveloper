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
}: {
  tickets: Ticket[]
}) {
  const [filter, setFilter] = useState<StatusFilter>("all")

  const filtered = filter === "all" ? tickets : tickets.filter((t) => t.status === filter)

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {FILTER_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded px-3 py-1 text-xs font-medium cursor-pointer ${
              filter === s
                ? "bg-gray-100 text-gray-900"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            {FILTER_LABELS[s]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card>
          <p className="text-center text-sm text-gray-400">
            No tickets found.
          </p>
        </Card>
      ) : (
        <ul className="flex flex-col gap-2">
          {filtered.map((ticket) => (
            <li key={ticket.id}>
              <Link href={`/tickets/${ticket.id}`} className="cursor-pointer hover:opacity-80">
                <Card>
                  <div className="flex items-center justify-between">
                    <span className={ticket.title ? "font-medium" : "font-medium text-gray-400"}>{ticket.title || "No Title"}</span>
                    <Badge variant={ticket.status} />
                  </div>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
