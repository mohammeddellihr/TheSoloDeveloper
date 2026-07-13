"use client"

import { useActionState } from "react"
import { updateRepositoryAction } from "@/app/actions"
import Button from "./Button"

export default function UpdateRepositoryForm({
  repositoryId,
  url,
}: {
  repositoryId: string
  url: string
}) {
  const [state, action, pending] = useActionState(updateRepositoryAction, null)

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="repositoryId" value={repositoryId} />
      <label className="text-sm font-medium text-gray-300" htmlFor="repository-url">Repository URL</label>
      <input
        id="repository-url"
        name="url"
        type="url"
        inputMode="url"
        placeholder="https://github.com/fastapi/fastapi"
        defaultValue={url}
        required
        className="input-field"
      />
      {state && "error" in state && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}
      <div className="-mx-4 px-4 pt-4 border-t border-gray-800 flex justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  )
}
