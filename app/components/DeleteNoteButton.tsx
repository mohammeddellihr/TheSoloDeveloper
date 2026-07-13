"use client"

import { useRef, useState } from "react"
import { useActionState } from "react"
import { deleteNoteAction } from "@/app/actions"
import ConfirmModal from "@/app/components/ConfirmModal"

export default function DeleteNoteButton({ noteId }: { noteId: string }) {
  const [, action, pending] = useActionState(deleteNoteAction, null)
  const [modalOpen, setModalOpen] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  function handleConfirm() {
    setModalOpen(false)
    formRef.current?.requestSubmit()
  }

  return (
    <>
      <form ref={formRef} action={action}>
        <input type="hidden" name="noteId" value={noteId} />
        <button
          type="button"
          disabled={pending}
          onClick={() => setModalOpen(true)}
          className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50 cursor-pointer"
        >
          {pending ? "Deleting..." : "Delete Note"}
        </button>
      </form>
      <ConfirmModal
        open={modalOpen}
        title="Delete Note?"
        message="This note will be permanently deleted."
        onConfirm={handleConfirm}
        onCancel={() => setModalOpen(false)}
      />
    </>
  )
}
