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
          className="input-field cursor-pointer"
          value={searchParams.get("repository_id") ?? ""}
          onChange={(e) => update("repository_id", e.target.value)}
        >
          <option value="">All Repositories</option>
          {repositories.map((repository) => (
            <option key={repository.id} value={repository.id}>{repository.name}</option>
          ))}
        </select>
        <select
          className="input-field cursor-pointer"
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
