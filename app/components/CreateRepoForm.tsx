"use client"

import { useActionState } from "react"
import { createRepositoryAction } from "@/app/actions"

export default function CreateRepoForm() {
  const [state, action, pending] = useActionState(createRepositoryAction, null)

  return (
    <form action={action} className="flex flex-col gap-3">
      <label className="sr-only" htmlFor="repo-name">Repository name</label>
      <input
        id="repo-name"
        name="name"
        placeholder="Repository name"
        required
        className="rounded border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
      />
      <label className="sr-only" htmlFor="repo-url">Repository URL</label>
      <input
        id="repo-url"
        name="url"
        placeholder="Repository URL"
        required
        className="rounded border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
      />
      {state && "error" in state && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {pending ? "Creating..." : "Add Repository"}
      </button>
    </form>
  )
}
