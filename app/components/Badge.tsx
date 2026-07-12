"use client"

import { STATUS_COLORS, STATUS_LABELS } from "@/lib/constants"
import type { Ticket } from "@/lib/db"

export default function Badge({ variant }: { variant: Ticket["status"] }) {
  const colors = STATUS_COLORS[variant]
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}>
      {STATUS_LABELS[variant]}
    </span>
  )
}
