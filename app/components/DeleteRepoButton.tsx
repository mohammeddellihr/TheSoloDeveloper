"use client"

import { useActionState } from "react"
import { deleteRepositoryAction } from "@/app/actions"
import Button from "@/app/components/Button"

export default function DeleteRepoButton({ repositoryId }: { repositoryId: string }) {
  const [state, action, pending] = useActionState(deleteRepositoryAction, null)

  return (
    <form action={action}>
      <input type="hidden" name="repositoryId" value={repositoryId} />
      {state && "error" in state && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}
      <Button variant="secondary" type="submit" disabled={pending}>
        {pending ? "Deleting..." : "Delete"}
      </Button>
    </form>
  )
}
