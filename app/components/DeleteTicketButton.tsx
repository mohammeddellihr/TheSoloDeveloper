"use client"

import { useRef, useState } from "react"
import { useActionState } from "react"
import { deleteTicketAction } from "@/app/actions"
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
        <button
          type="button"
          disabled={pending}
          onClick={() => setModalOpen(true)}
          className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50 cursor-pointer"
        >
          {pending ? "Deleting..." : "Delete Ticket"}
        </button>
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
