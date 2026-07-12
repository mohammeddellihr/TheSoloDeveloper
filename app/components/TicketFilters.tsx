"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { STATUSES } from "@/lib/constants"
import { STATUS_LABELS } from "@/lib/constants"
import type { Repository } from "@/lib/db"

export default function TicketFilters({ repositories }: { repositories: Repository[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/tickets?${params.toString()}`)
  }

  return (
    <div className="flex gap-2">
      <select
        className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm cursor-pointer dark:border-gray-700 dark:bg-gray-800"
        value={searchParams.get("repository_id") ?? ""}
        onChange={(e) => update("repository_id", e.target.value)}
      >
        <option value="">All Repos</option>
        {repositories.map((repo) => (
          <option key={repo.id} value={repo.id}>{repo.name}</option>
        ))}
      </select>
      <select
        className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm cursor-pointer dark:border-gray-700 dark:bg-gray-800"
        value={searchParams.get("status") ?? ""}
        onChange={(e) => update("status", e.target.value)}
      >
        <option value="">All Statuses</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>{STATUS_LABELS[s]}</option>
        ))}
      </select>
    </div>
  )
}
