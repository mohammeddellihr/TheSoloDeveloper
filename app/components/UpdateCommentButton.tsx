"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { updateCommentAction, deleteCommentAction } from "@/app/actions"
import Button from "@/app/components/Button"
import Card from "@/app/components/Card"
import ConfirmDeleteButton from "@/app/components/ConfirmDeleteButton"
import CopyContentButton from "@/app/components/CopyContentButton"
import AutoResizeTextarea from "@/app/components/AutoResizeTextarea"

export default function UpdateCommentButton({
  ownerType,
  ownerId,
  commentId,
  initialText,
}: {
  ownerType: "ticket" | "note"
  ownerId: string
  commentId: string
  initialText: string
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(initialText)
  const [error, setError] = useState<string | null>(null)

  function handleSave() {
    if (!text.trim()) {
      setError("Comment cannot be empty")
      return
    }
    const formData = new FormData()
    if (ownerType === "ticket") {
      formData.set("ticketId", ownerId)
    } else {
      formData.set("noteId", ownerId)
    }
    formData.set("commentId", commentId)
    formData.set("text", text.trim())
    startTransition(async () => {
      const result = await updateCommentAction(null, formData)
      if (result?.error) {
        setError(result.error)
      } else {
        setEditing(false)
        setError(null)
        router.refresh()
      }
    })
  }

  const deleteHiddenFields =
    ownerType === "ticket"
      ? ({ ticketId: ownerId, commentId } as Record<string, string>)
      : ({ noteId: ownerId, commentId } as Record<string, string>)

  return (
    <Card>
      <div className="flex items-start justify-between">
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{initialText}</p>
        <div className="flex items-center gap-1">
          <ConfirmDeleteButton
            action={deleteCommentAction}
            hiddenFields={deleteHiddenFields}
            title="Delete Comment?"
            message="This comment will be permanently deleted."
            label="Delete comment"
            variant="icon"
          />
          <button
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              setEditing(true)
            }}
            className="rounded p-1 text-gray-400 hover:text-gray-300 cursor-pointer"
            aria-label="Edit comment"
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
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              <path d="m15 5 4 4" />
            </svg>
          </button>
          <CopyContentButton content={initialText} />
        </div>
      </div>
    </Card>
  )
}
