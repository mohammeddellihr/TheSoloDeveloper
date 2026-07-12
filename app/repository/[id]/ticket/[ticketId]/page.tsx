import Link from "next/link"
import { notFound } from "next/navigation"
import { getRepository, getTicket } from "@/lib/db"
import { STATUS_LABELS, STATUS_COLORS } from "@/lib/constants"
import StatusDropdown from "@/app/components/StatusDropdown"
import CommentForm from "@/app/components/CommentForm"

export default async function TicketPage({
  params,
}: {
  params: Promise<{ id: string; ticketId: string }>
}) {
  const { id, ticketId } = await params
  const repo = getRepository(id)
  const ticket = getTicket(id, ticketId)

  if (!repo || !ticket) notFound()

  const colors = STATUS_COLORS[ticket.status]

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-12">
      <div>
        <Link
          href={`/repository/${repo.id}`}
          className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
        >
          &larr; {repo.name}
        </Link>
      </div>

      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">{ticket.title}</h1>
        <StatusDropdown repoId={repo.id} ticketId={ticket.id} currentStatus={ticket.status} />
      </div>

      <div className="flex items-center gap-3 text-sm text-zinc-500">
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}>
          {STATUS_LABELS[ticket.status]}
        </span>
        <span>Created {new Date(ticket.createdAt).toLocaleDateString()}</span>
        <span>Updated {new Date(ticket.updatedAt).toLocaleDateString()}</span>
      </div>

      {ticket.description && (
        <div className="whitespace-pre-wrap rounded-lg border border-zinc-200 p-4 text-sm leading-relaxed dark:border-zinc-800">
          {ticket.description}
        </div>
      )}

      <div>
        <h2 className="mb-4 text-lg font-semibold">
          Comments ({ticket.comments.length})
        </h2>

        {ticket.comments.length === 0 ? (
          <p className="text-sm text-zinc-500">No comments yet.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {ticket.comments.map((comment) => (
              <li
                key={comment.id}
                className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"
              >
                <p className="text-sm">{comment.text}</p>
                <p className="mt-1 text-xs text-zinc-400">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4">
          <CommentForm repoId={repo.id} ticketId={ticket.id} />
        </div>
      </div>
    </div>
  )
}
