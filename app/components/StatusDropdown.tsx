"use client"

import { useActionState } from "react"
import { updateTicketStatusAction } from "@/app/actions"
import { STATUS_LABELS, STATUS_COLORS, STATUSES } from "@/lib/constants"
import type { Ticket } from "@/lib/db"

export default function StatusDropdown({
  repoId,
  ticketId,
  currentStatus,
}: {
  repoId: string
  ticketId: string
  currentStatus: Ticket["status"]
}) {
  const [, formAction, pending] = useActionState(updateTicketStatusAction, undefined)
  const colors = STATUS_COLORS[currentStatus]

  return (
    <form action={formAction}>
      <input type="hidden" name="repoId" value={repoId} />
      <input type="hidden" name="ticketId" value={ticketId} />
      <select
        name="status"
        defaultValue={currentStatus}
        onChange={(e) => e.target.form?.requestSubmit()}
        disabled={pending}
        className={`rounded-full px-3 py-1 text-xs font-medium ${colors.bg} ${colors.text} border-0 cursor-pointer disabled:opacity-50`}
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABELS[s]}
          </option>
        ))}
      </select>
    </form>
  )
}
