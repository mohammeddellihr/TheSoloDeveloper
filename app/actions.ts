"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { STATUSES } from "@/lib/constants"
import { createRepository, createTicket, updateTicketStatus, addComment, updateRepository, deleteRepository, updateTicket, deleteTicket } from "@/lib/db"

export async function createTicketAction(_prev: unknown, formData: FormData) {
  const repositoryId = formData.get("repositoryId")
  const title = formData.get("title")
  const description = formData.get("description")

  if (typeof repositoryId !== "string" || typeof title !== "string" || !title.trim()) {
    return { error: "Title is required" }
  }

  try {
    const ticket = createTicket(repositoryId, title.trim(), typeof description === "string" ? description.trim() : "")
    redirect(`/repository/${repositoryId}/ticket/${ticket.id}`)
  } catch (e) {
    if (e instanceof Error && 'digest' in e && typeof e.digest === 'string' && e.digest.startsWith("NEXT_REDIRECT")) throw e
    return { error: "Failed to create ticket" }
  }
}

export async function updateTicketStatusAction(_prev: unknown, formData: FormData) {
  const repositoryId = formData.get("repositoryId")
  const ticketId = formData.get("ticketId")
  const status = formData.get("status")

  if (typeof repositoryId !== "string" || typeof ticketId !== "string" || typeof status !== "string") {
    return { error: "Invalid request" }
  }

  if (!(STATUSES as readonly string[]).includes(status)) {
    return { error: "Invalid status" }
  }

  try {
    const ticket = updateTicketStatus(repositoryId, ticketId, status as "pending" | "in_progress" | "completed")
    if (!ticket) return { error: "Ticket not found" }
    revalidatePath(`/repository/${repositoryId}/ticket/${ticketId}`)
  } catch {
    return { error: "Failed to update status" }
  }
}

export async function addCommentAction(_prev: unknown, formData: FormData) {
  const repositoryId = formData.get("repositoryId")
  const ticketId = formData.get("ticketId")
  const text = formData.get("text")

  if (typeof repositoryId !== "string" || typeof ticketId !== "string" || typeof text !== "string" || !text.trim()) {
    return { error: "Comment text is required" }
  }

  try {
    addComment(repositoryId, ticketId, text.trim())
    revalidatePath(`/repository/${repositoryId}/ticket/${ticketId}`)
    return { error: null }
  } catch {
    return { error: "Failed to add comment" }
  }
}

function nameFromUrl(url: string): string {
  try {
    const { pathname } = new URL(url)
    return pathname.replace(/^\/+/, "").replace(/\/+$/, "") || url
  } catch {
    return url
  }
}

export async function createRepositoryAction(_prev: unknown, formData: FormData) {
  const url = formData.get("url")

  if (typeof url !== "string" || !url.trim()) {
    return { error: "URL is required" }
  }

  const name = nameFromUrl(url.trim())

  try {
    const repo = createRepository(name, url.trim())
    redirect(`/repository/${repo.id}`)
  } catch (e) {
    if (e instanceof Error && 'digest' in e && typeof e.digest === 'string' && e.digest.startsWith("NEXT_REDIRECT")) throw e
    return { error: "Failed to create repository" }
  }
}

export async function updateRepositoryAction(_prev: unknown, formData: FormData) {
  const repositoryId = formData.get("repositoryId")
  const url = formData.get("url")

  if (typeof repositoryId !== "string" || typeof url !== "string" || !url.trim()) {
    return { error: "URL is required" }
  }

  const name = nameFromUrl(url.trim())

  try {
    const repo = updateRepository(repositoryId, name, url.trim())
    if (!repo) return { error: "Repository not found" }
    redirect(`/repository/${repositoryId}`)
  } catch (e) {
    if (e instanceof Error && 'digest' in e && typeof e.digest === 'string' && e.digest.startsWith("NEXT_REDIRECT")) throw e
    return { error: "Failed to update repository" }
  }
}

export async function deleteRepositoryAction(_prev: unknown, formData: FormData) {
  const repositoryId = formData.get("repositoryId")

  if (typeof repositoryId !== "string") {
    return { error: "Invalid request" }
  }

  try {
    deleteRepository(repositoryId)
    redirect("/repositories")
  } catch (e) {
    if (e instanceof Error && 'digest' in e && typeof e.digest === 'string' && e.digest.startsWith("NEXT_REDIRECT")) throw e
    return { error: "Failed to delete repository" }
  }
}

export async function updateTicketAction(_prev: unknown, formData: FormData) {
  const repositoryId = formData.get("repositoryId")
  const ticketId = formData.get("ticketId")
  const title = formData.get("title")
  const description = formData.get("description")
  const status = formData.get("status")

  if (typeof repositoryId !== "string" || typeof ticketId !== "string" || typeof title !== "string" || typeof status !== "string" || !title.trim()) {
    return { error: "Title and status are required" }
  }

  if (!(STATUSES as readonly string[]).includes(status)) {
    return { error: "Invalid status" }
  }

  try {
    const ticket = updateTicket(repositoryId, ticketId, title.trim(), typeof description === "string" ? description.trim() : "", status as "pending" | "in_progress" | "completed")
    if (!ticket) return { error: "Ticket not found" }
    redirect(`/repository/${repositoryId}/ticket/${ticketId}`)
  } catch (e) {
    if (e instanceof Error && 'digest' in e && typeof e.digest === 'string' && e.digest.startsWith("NEXT_REDIRECT")) throw e
    return { error: "Failed to update ticket" }
  }
}

export async function deleteTicketAction(_prev: unknown, formData: FormData) {
  const repositoryId = formData.get("repositoryId")
  const ticketId = formData.get("ticketId")

  if (typeof repositoryId !== "string" || typeof ticketId !== "string") {
    return { error: "Invalid request" }
  }

  try {
    deleteTicket(repositoryId, ticketId)
    redirect(`/repository/${repositoryId}`)
  } catch (e) {
    if (e instanceof Error && 'digest' in e && typeof e.digest === 'string' && e.digest.startsWith("NEXT_REDIRECT")) throw e
    return { error: "Failed to delete ticket" }
  }
}
