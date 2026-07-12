"use client"

import { useRouter, useSearchParams } from "next/navigation"

export default function NoteSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const q = searchParams.get("q") ?? ""

  function update(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set("q", value)
    else params.delete("q")
    router.push(`/notes?${params.toString()}`)
  }

  return (
    <input
      type="search"
      autoFocus
      value={q}
      onChange={(e) => update(e.target.value)}
      placeholder="Search notes..."
      className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black dark:focus:border-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
    />
  )
}
