"use client"

import { useRef, useState } from "react"
import { useActionState } from "react"
import { deleteRepositoryAction } from "@/app/actions"
import Button from "@/app/components/Button"
import ConfirmModal from "@/app/components/ConfirmModal"

export default function DeleteRepoButton({ repositoryId }: { repositoryId: string }) {
  const [state, action, pending] = useActionState(deleteRepositoryAction, null)
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
        {state && "error" in state && (
          <p className="text-sm text-red-500">{state.error}</p>
        )}
        <Button
          type="button"
          disabled={pending}
          onClick={() => setModalOpen(true)}
        >
          {pending ? "Deleting..." : "Delete Repository"}
        </Button>
      </form>
      <ConfirmModal
        open={modalOpen}
        title="Delete Repository?"
        message="This will also delete all its tickets and comments. This action cannot be undone."
        onConfirm={handleConfirm}
        onCancel={() => setModalOpen(false)}
      />
    </>
  )
}
