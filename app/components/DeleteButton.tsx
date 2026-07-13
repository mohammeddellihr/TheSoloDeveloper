"use client"

import { deleteCommentAction } from "@/app/actions"
import ConfirmDeleteButton from "@/app/components/ConfirmDeleteButton"

export default function DeleteButton({
  repositoryId,
  ticketId,
  commentId,
}: {
  repositoryId: string
  ticketId: string
  commentId: string
}) {
  return (
    <ConfirmDeleteButton
      action={deleteCommentAction}
      hiddenFields={{ repositoryId, ticketId, commentId }}
      title="Delete Comment?"
      message="This comment will be permanently deleted."
      label="Delete comment"
      variant="icon"
    />
  )
}
