"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { updateCommentAction } from "@/app/actions"
import Button from "@/app/components/Button"
import Card from "@/app/components/Card"
import DeleteButton from "@/app/components/DeleteButton"
import CopyContentButton from "@/app/components/CopyContentButton"

export default function UpdateCommentButton({
  repositoryId,
  ticketId,
  commentId,
  initialText,
}: {
  repositoryId: string
  ticketId: string
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
    formData.set("repositoryId", repositoryId)
    formData.set("ticketId", ticketId)
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

  function handleCancel() {
    setText(initialText)
    setEditing(false)
    setError(null)
  }

  if (editing) {
    return (
      <Card>
        <div className="flex flex-col gap-3">
          <div className="-mx-4 px-4 pb-4 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-sm font-semibold">Update Comment</h3>
          </div>
          <div className="pt-2">
            <textarea
              value={text}
              onChange={(e) => {
                setText(e.target.value)
                setError(null)
              }}
              rows={3}
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              disabled={pending}
            />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="-mx-4 px-4 pt-4 mt-4 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={handleCancel}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={pending}
            >
              {pending ? "Saving..." : "Update Comment"}
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <div className="flex items-start justify-between">
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{initialText}</p>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              setEditing(true)
            }}
            className="rounded p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
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
          <DeleteButton repositoryId={repositoryId} ticketId={ticketId} commentId={commentId} />
          <CopyContentButton content={initialText} />
        </div>
      </div>
    </Card>
  )
}
