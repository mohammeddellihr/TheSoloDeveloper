"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { deleteCommentAction } from "@/app/actions"
import ConfirmModal from "@/app/components/ConfirmModal"

export default function DeleteButton({
  repositoryId,
  ticketId,
  commentId,
}: {
  repositoryId: string
  ticketId: string
  commentId: string
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [modalOpen, setModalOpen] = useState(false)

  function handleConfirm() {
    setModalOpen(false)
    const formData = new FormData()
    formData.set("repositoryId", repositoryId)
    formData.set("ticketId", ticketId)
    formData.set("commentId", commentId)
    startTransition(async () => {
      await deleteCommentAction(null, formData)
      router.refresh()
    })
  }

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
          setModalOpen(true)
        }}
        disabled={pending}
        className="rounded p-1 text-gray-400 hover:text-red-400 disabled:opacity-50 cursor-pointer"
        aria-label="Delete comment"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
      </button>
      <ConfirmModal
        open={modalOpen}
        title="Delete Comment?"
        message="This comment will be permanently deleted."
        onConfirm={handleConfirm}
        onCancel={() => setModalOpen(false)}
      />
    </>
  )
}
