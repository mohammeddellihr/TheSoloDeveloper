"use client"

import { useActionState } from "react"
import { deleteNoteAction } from "@/app/actions"
import Button from "./Button"

export default function DeleteNoteButton({ noteId }: { noteId: number }) {
  const [, action, pending] = useActionState(deleteNoteAction, null)

  return (
    <form action={action}>
      <input type="hidden" name="noteId" value={noteId} />
      <Button type="submit" variant="secondary" disabled={pending} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
        {pending ? "Deleting..." : "Delete"}
      </Button>
    </form>
  )
}
