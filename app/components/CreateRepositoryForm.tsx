"use client"

import { useActionState } from "react"
import { createRepositoryAction } from "@/app/actions"
import Button from "./Button"

export default function CreateRepositoryForm() {
  const [state, action, pending] = useActionState(createRepositoryAction, null)

  return (
    <form action={action} className="flex flex-col gap-3">
      <label className="text-sm font-medium text-gray-300" htmlFor="repository-url">Repository URL</label>
      <input
        id="repository-url"
        name="url"
        type="url"
        inputMode="url"
        placeholder="https://github.com/fastapi/fastapi"
        required
        className="input-field"
      />
      {state && "error" in state && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}
      <div className="form-footer">
        <Button type="submit" disabled={pending}>
          {pending ? "Creating..." : "Create Repository"}
        </Button>
      </div>
    </form>
  )
}
