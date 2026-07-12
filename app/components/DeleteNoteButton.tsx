"use client"

import { useRef, useState } from "react"
import { useActionState } from "react"
import { deleteNoteAction } from "@/app/actions"
import Button from "./Button"
import ConfirmModal from "@/app/components/ConfirmModal"

export default function DeleteNoteButton({ noteId }: { noteId: number }) {
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
        <Button
          type="button"
          disabled={pending}
          onClick={() => setModalOpen(true)}
        >
          {pending ? "Deleting..." : "Delete Note"}
        </Button>
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
