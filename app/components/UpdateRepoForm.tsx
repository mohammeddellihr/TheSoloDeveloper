"use client"

import { useActionState } from "react"
import { updateRepositoryAction } from "@/app/actions"

export default function UpdateRepoForm({
  repositoryId,
  name,
  url,
}: {
  repositoryId: string
  name: string
  url: string
}) {
  const [state, action, pending] = useActionState(updateRepositoryAction, null)

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="repositoryId" value={repositoryId} />
      <label className="sr-only" htmlFor="repo-name">Repository name</label>
      <input
        id="repo-name"
        name="name"
        placeholder="Repository name"
        defaultValue={name}
        required
        className="rounded border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
      />
      <label className="sr-only" htmlFor="repo-url">Repository URL</label>
      <input
        id="repo-url"
        name="url"
        placeholder="Repository URL"
        defaultValue={url}
        required
        className="rounded border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
      />
      {state && "error" in state && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}
      <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 mt-4 flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 disabled:opacity-50"
        >
          {pending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  )
}
