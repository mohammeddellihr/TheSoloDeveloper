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
      className="input-field w-64"
    />
  )
}
