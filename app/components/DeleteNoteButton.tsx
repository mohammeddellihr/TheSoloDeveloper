"use client"

import { useActionState } from "react"
import { deleteNoteAction } from "@/app/actions"
import Button from "./Button"

export default function DeleteNoteButton({ noteId }: { noteId: number }) {
  const [, action, pending] = useActionState(deleteNoteAction, null)

  return (
    <form action={action}>
      <input type="hidden" name="noteId" value={noteId} />
      <Button type="submit" disabled={pending}>
        {pending ? "Deleting..." : "Delete Note"}
      </Button>
    </form>
  )
}
