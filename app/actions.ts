"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { STATUSES } from "@/lib/constants"
import { createRepository, createTicket, updateTicketStatus, addComment } from "@/lib/db"

export async function createTicketAction(_prev: unknown, formData: FormData) {
  const repoId = formData.get("repoId")
  const title = formData.get("title")
  const description = formData.get("description")

  if (typeof repoId !== "string" || typeof title !== "string" || !title.trim()) {
    return { error: "Title is required" }
  }

  try {
    const ticket = createTicket(repoId, title.trim(), typeof description === "string" ? description.trim() : "")
    redirect(`/repository/${repoId}/ticket/${ticket.id}`)
  } catch (e) {
    if (e instanceof Error && 'digest' in e && typeof e.digest === 'string' && e.digest.startsWith("NEXT_REDIRECT")) throw e
    return { error: "Failed to create ticket" }
  }
}

export async function updateTicketStatusAction(_prev: unknown, formData: FormData) {
  const repoId = formData.get("repoId")
  const ticketId = formData.get("ticketId")
  const status = formData.get("status")

  if (typeof repoId !== "string" || typeof ticketId !== "string" || typeof status !== "string") {
    return { error: "Invalid request" }
  }

  if (!(STATUSES as readonly string[]).includes(status)) {
    return { error: "Invalid status" }
  }

  try {
    const ticket = updateTicketStatus(repoId, ticketId, status as "pending" | "in_progress" | "completed")
    if (!ticket) return { error: "Ticket not found" }
    revalidatePath(`/repository/${repoId}/ticket/${ticketId}`)
  } catch {
    return { error: "Failed to update status" }
  }
}

export async function addCommentAction(_prev: unknown, formData: FormData) {
  const repoId = formData.get("repoId")
  const ticketId = formData.get("ticketId")
  const text = formData.get("text")

  if (typeof repoId !== "string" || typeof ticketId !== "string" || typeof text !== "string" || !text.trim()) {
    return { error: "Comment text is required" }
  }

  try {
    addComment(repoId, ticketId, text.trim())
    revalidatePath(`/repository/${repoId}/ticket/${ticketId}`)
    return { error: null }
  } catch {
    return { error: "Failed to add comment" }
  }
}

export async function createRepositoryAction(_prev: unknown, formData: FormData) {
  const name = formData.get("name")
  const url = formData.get("url")

  if (typeof name !== "string" || typeof url !== "string" || !name.trim() || !url.trim()) {
    return { error: "Name and URL are required" }
  }

  try {
    const repo = createRepository(name.trim(), url.trim())
    redirect(`/repository/${repo.id}`)
  } catch (e) {
    if (e instanceof Error && 'digest' in e && typeof e.digest === 'string' && e.digest.startsWith("NEXT_REDIRECT")) throw e
    return { error: "Failed to create repository" }
  }
}
