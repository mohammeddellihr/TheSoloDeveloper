"use client"

import { useActionState } from "react"
import { createRepositoryAction } from "@/app/actions"

export default function CreateRepoForm() {
  const [state, action, pending] = useActionState(createRepositoryAction, null)

  return (
    <form action={action} className="flex flex-col gap-3">
      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300" htmlFor="repo-name">Repository name</label>
      <input
        id="repo-name"
        name="name"
        placeholder="Repository name"
        required
        className="rounded border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-black dark:focus:border-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
      />
      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300" htmlFor="repo-url">Repository URL (optional)</label>
      <input
        id="repo-url"
        name="url"
        type="url"
        inputMode="url"
        placeholder="Repository URL (optional)"
        className="rounded border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-black dark:focus:border-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
      />
      {state && "error" in state && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}
      <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 mt-4 flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 disabled:opacity-50 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:focus-visible:outline-white"
        >
          {pending ? "Creating..." : "Add Repository"}
        </button>
      </div>
    </form>
  )
}
