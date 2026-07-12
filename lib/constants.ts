import type { Ticket } from "@/lib/db"

export const STATUS_LABELS: Record<Ticket["status"], string> = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
  archived: "Archived",
}

export const STATUS_COLORS: Record<Ticket["status"], { bg: string; text: string }> = {
  pending: { bg: "bg-orange-100", text: "text-orange-700" },
  in_progress: { bg: "bg-blue-100", text: "text-blue-700" },
  completed: { bg: "bg-green-100", text: "text-green-700" },
  archived: { bg: "bg-gray-100", text: "text-gray-700" },
}

export const STATUSES: Ticket["status"][] = ["pending", "in_progress", "completed", "archived"]
