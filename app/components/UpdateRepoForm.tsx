"use client"

import { useActionState } from "react"
import { updateRepositoryAction } from "@/app/actions"

export default function UpdateRepoForm({
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
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="repo-url">Repository URL</label>
      <input
        id="repo-url"
        name="url"
        type="url"
        inputMode="url"
        placeholder="https://github.com/fastapi/fastapi"
        defaultValue={url}
        required
        className="rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
      />
      {state && "error" in state && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}
      <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mt-4 flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 disabled:opacity-50 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:focus-visible:outline-white"
        >
          {pending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  )
}
