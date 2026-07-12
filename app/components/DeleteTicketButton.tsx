"use client"

import { useRef, useState } from "react"
import { useActionState } from "react"
import { deleteTicketAction } from "@/app/actions"
import Button from "@/app/components/Button"
import ConfirmModal from "@/app/components/ConfirmModal"

export default function DeleteTicketButton({ repositoryId, ticketId }: { repositoryId: string; ticketId: string }) {
  const [state, action, pending] = useActionState(deleteTicketAction, null)
  const [modalOpen, setModalOpen] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  function handleConfirm() {
    setModalOpen(false)
    formRef.current?.requestSubmit()
  }

  return (
    <>
      <form ref={formRef} action={action}>
        <input type="hidden" name="repositoryId" value={repositoryId} />
        <input type="hidden" name="ticketId" value={ticketId} />
        {state && "error" in state && (
          <p className="text-sm text-red-500">{state.error}</p>
        )}
        <Button
          type="button"
          disabled={pending}
          onClick={() => setModalOpen(true)}
        >
          {pending ? "Deleting..." : "Delete Ticket"}
        </Button>
      </form>
      <ConfirmModal
        open={modalOpen}
        title="Delete Ticket?"
        message="This will also delete all its comments. This action cannot be undone."
        onConfirm={handleConfirm}
        onCancel={() => setModalOpen(false)}
      />
    </>
  )
}
