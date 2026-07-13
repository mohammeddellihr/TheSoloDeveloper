"use client"

import { useRef, useState } from "react"
import { useActionState } from "react"
import { deleteRepositoryAction } from "@/app/actions"
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
        <button
          type="button"
          disabled={pending}
          onClick={() => setModalOpen(true)}
          className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50 cursor-pointer"
        >
          {pending ? "Deleting..." : "Delete Repository"}
        </button>
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
