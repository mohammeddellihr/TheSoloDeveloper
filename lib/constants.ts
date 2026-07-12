import type { Ticket } from "@/lib/db"

export const STATUS_LABELS: Record<Ticket["status"], string> = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
  archived: "Archived",
}

export const STATUS_COLORS: Record<Ticket["status"], { bg: string; text: string }> = {
  pending: { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-300" },
  in_progress: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-300" },
  completed: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-300" },
  archived: { bg: "bg-gray-100 dark:bg-gray-600/30", text: "text-gray-700 dark:text-gray-300" },
}

export const STATUSES: Ticket["status"][] = ["pending", "in_progress", "completed", "archived"]
