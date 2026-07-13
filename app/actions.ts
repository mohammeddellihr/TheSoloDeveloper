"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { STATUSES } from "@/lib/constants"
import { createRepository, createTicket, updateTicketStatus, addComment, addNoteComment, deleteComment, updateComment, updateRepository, deleteRepository, updateTicket, deleteTicket, createNote, updateNote, deleteNote } from "@/lib/db"
import type { Ticket } from "@/lib/db"

function withRedirect(errorMessage: string, fn: () => void): { error: string } | never {
  try {
    fn()
  } catch (e) {
    if (e instanceof Error && 'digest' in e && typeof e.digest === 'string' && e.digest.startsWith("NEXT_REDIRECT")) throw e
    return { error: errorMessage }
  }
  return { error: errorMessage }
}

export async function createTicketAction(_prev: unknown, formData: FormData) {
  const repositoryId = formData.get("repositoryId")
  const title = formData.get("title")
  const content = formData.get("content")
  const status = formData.get("status")

  if (typeof repositoryId !== "string" || typeof title !== "string") {
    return { error: "Invalid request" }
  }

  const validStatus = STATUSES.includes(status as Ticket["status"]) ? status as Ticket["status"] : "pending"

  return withRedirect("Failed to create ticket", () => {
    const ticket = createTicket(repositoryId, title.trim(), typeof content === "string" ? content.trim() : "", validStatus)
    redirect(`/tickets/${ticket.id}`)
  })
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
    const ticket = updateTicketStatus(ticketId, status as "pending" | "in_progress" | "completed")
    if (!ticket) return { error: "Ticket not found" }
    revalidatePath(`/tickets/${ticketId}`)
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
    addComment(ticketId, text.trim())
    revalidatePath(`/tickets/${ticketId}`)
    return { error: null }
  } catch {
    return { error: "Failed to add comment" }
  }
}

export async function addNoteCommentAction(_prev: unknown, formData: FormData) {
  const noteId = formData.get("noteId")
  const text = formData.get("text")

  if (typeof noteId !== "string" || typeof text !== "string" || !text.trim()) {
    return { error: "Comment text is required" }
  }

  try {
    addNoteComment(noteId, text.trim())
    revalidatePath(`/notes/${noteId}`)
    return { error: null }
  } catch {
    return { error: "Failed to add comment" }
  }
}

export async function updateCommentAction(_prev: unknown, formData: FormData) {
  const repositoryId = formData.get("repositoryId")
  const ticketId = formData.get("ticketId")
  const noteId = formData.get("noteId")
  const commentId = formData.get("commentId")
  const text = formData.get("text")

  if (typeof commentId !== "string" || typeof text !== "string" || !text.trim()) {
    return { error: "Comment text is required" }
  }

  if (typeof ticketId === "string" && typeof repositoryId === "string") {
    try {
      const comment = updateComment(commentId, text.trim())
      if (!comment) return { error: "Comment not found" }
      revalidatePath(`/tickets/${ticketId}`)
      return { error: null }
    } catch {
      return { error: "Failed to update comment" }
    }
  }

  if (typeof noteId === "string") {
    try {
      const comment = updateComment(commentId, text.trim())
      if (!comment) return { error: "Comment not found" }
      revalidatePath(`/notes/${noteId}`)
      return { error: null }
    } catch {
      return { error: "Failed to update comment" }
    }
  }

  return { error: "Invalid request" }
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

  return withRedirect("Failed to create repository", () => {
    const repository = createRepository(name, url.trim())
    redirect(`/repositories/${repository.id}`)
  })
}

export async function updateRepositoryAction(_prev: unknown, formData: FormData) {
  const repositoryId = formData.get("repositoryId")
  const url = formData.get("url")

  if (typeof repositoryId !== "string" || typeof url !== "string" || !url.trim()) {
    return { error: "URL is required" }
  }

  const name = nameFromUrl(url.trim())

  const repository = updateRepository(repositoryId, name, url.trim())
  if (!repository) return { error: "Repository not found" }
  return withRedirect("Failed to update repository", () => {
    redirect(`/repositories/${repositoryId}`)
  })
}

export async function deleteRepositoryAction(_prev: unknown, formData: FormData) {
  const repositoryId = formData.get("repositoryId")

  if (typeof repositoryId !== "string") {
    return { error: "Invalid request" }
  }

  return withRedirect("Failed to delete repository", () => {
    deleteRepository(repositoryId)
    redirect("/repositories")
  })
}

export async function updateTicketAction(_prev: unknown, formData: FormData) {
  const repositoryId = formData.get("repositoryId")
  const ticketId = formData.get("ticketId")
  const title = formData.get("title")
  const content = formData.get("content")
  const status = formData.get("status")

  if (typeof repositoryId !== "string" || typeof ticketId !== "string" || typeof title !== "string" || typeof status !== "string") {
    return { error: "Invalid request" }
  }

  if (!(STATUSES as readonly string[]).includes(status)) {
    return { error: "Invalid status" }
  }

  const ticket = updateTicket(ticketId, title.trim(), typeof content === "string" ? content.trim() : "", status as "pending" | "in_progress" | "completed", repositoryId)
  if (!ticket) return { error: "Ticket not found" }
  return withRedirect("Failed to update ticket", () => {
    redirect(`/tickets/${ticketId}`)
  })
}

export async function deleteTicketAction(_prev: unknown, formData: FormData) {
  const repositoryId = formData.get("repositoryId")
  const ticketId = formData.get("ticketId")

  if (typeof repositoryId !== "string" || typeof ticketId !== "string") {
    return { error: "Invalid request" }
  }

  return withRedirect("Failed to delete ticket", () => {
    deleteTicket(ticketId)
    redirect(`/tickets`)
  })
}

export async function createNoteAction(_prev: unknown, formData: FormData) {
  const title = formData.get("title")
  const content = formData.get("content")
  const keywords = formData.get("keywords")

  if (typeof title !== "string") {
    return { error: "Invalid request" }
  }

  const keywordList = typeof keywords === "string" && keywords.trim()
    ? keywords.split(",").map(k => k.trim()).filter(Boolean)
    : []

  return withRedirect("Failed to create note", () => {
    const note = createNote(title.trim(), typeof content === "string" ? content.trim() : "", keywordList)
    redirect(`/notes/${note.id}`)
  })
}

export async function updateNoteAction(_prev: unknown, formData: FormData) {
  const noteId = formData.get("noteId")
  const title = formData.get("title")
  const content = formData.get("content")
  const keywords = formData.get("keywords")

  if (typeof noteId !== "string" || typeof title !== "string") {
    return { error: "Invalid request" }
  }

  const keywordList = typeof keywords === "string" && keywords.trim()
    ? keywords.split(",").map(k => k.trim()).filter(Boolean)
    : []

  const note = updateNote(noteId, title.trim(), typeof content === "string" ? content.trim() : "", keywordList)
  if (!note) return { error: "Note not found" }
  return withRedirect("Failed to update note", () => {
    redirect(`/notes/${note.id}`)
  })
}

export async function deleteNoteAction(_prev: unknown, formData: FormData) {
  const noteId = formData.get("noteId")

  if (typeof noteId !== "string") {
    return { error: "Invalid request" }
  }

  return withRedirect("Failed to delete note", () => {
    deleteNote(noteId)
    redirect("/notes")
  })
}

export async function deleteCommentAction(_prev: unknown, formData: FormData) {
  const repositoryId = formData.get("repositoryId")
  const ticketId = formData.get("ticketId")
  const noteId = formData.get("noteId")
  const commentId = formData.get("commentId")

  if (typeof commentId !== "string") {
    return { error: "Invalid request" }
  }

  if (typeof ticketId === "string" && typeof repositoryId === "string") {
    try {
      deleteComment(commentId)
      revalidatePath(`/tickets/${ticketId}`)
      return { error: null }
    } catch {
      return { error: "Failed to delete comment" }
    }
  }

  if (typeof noteId === "string") {
    try {
      deleteComment(commentId)
      revalidatePath(`/notes/${noteId}`)
      return { error: null }
    } catch {
      return { error: "Failed to delete comment" }
    }
  }

  return { error: "Invalid request" }
}
