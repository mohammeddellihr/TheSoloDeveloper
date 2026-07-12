"use client"

import { useActionState } from "react"
import { deleteTicketAction } from "@/app/actions"
import Button from "@/app/components/Button"

export default function DeleteTicketButton({ repositoryId, ticketId }: { repositoryId: string; ticketId: string }) {
  const [state, action, pending] = useActionState(deleteTicketAction, null)

  return (
    <form action={action}>
      <input type="hidden" name="repositoryId" value={repositoryId} />
      <input type="hidden" name="ticketId" value={ticketId} />
      {state && "error" in state && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}
      <Button variant="secondary" type="submit" disabled={pending}>
        {pending ? "Deleting..." : "Delete Ticket"}
      </Button>
    </form>
  )
}
