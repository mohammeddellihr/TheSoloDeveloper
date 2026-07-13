"use client"

import { useActionState } from "react"
import { createRepositoryAction } from "@/app/actions"
import Button from "./Button"

export default function CreateRepositoryForm() {
  const [state, action, pending] = useActionState(createRepositoryAction, null)

  return (
    <form action={action} className="flex flex-col gap-3">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="repository-url">Repository URL</label>
      <input
        id="repository-url"
        name="url"
        type="url"
        inputMode="url"
        placeholder="https://github.com/fastapi/fastapi"
        required
        className="rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
      />
      {state && "error" in state && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}
      <div className="-mx-4 px-4 pt-4 mt-4 border-t border-gray-200 dark:border-gray-800 flex justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? "Creating..." : "Create Repository"}
        </Button>
      </div>
    </form>
  )
}
