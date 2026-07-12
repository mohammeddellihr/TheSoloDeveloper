import Link from "next/link"
import { notFound } from "next/navigation"
import { getRepository, getTicket } from "@/lib/db"
import Header from "@/app/components/Header"
import Card from "@/app/components/Card"
import Badge from "@/app/components/Badge"
import Button from "@/app/components/Button"
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

  return (
    <>
      <Header
        breadcrumbs={[{ label: "Tickets", href: "/tickets" }]}
        title={ticket.title}
        actions={
          <Link href={`/repository/${repo.id}/ticket/${ticket.id}/update`}>
            <Button variant="secondary">Update</Button>
          </Link>
        }
      />

      <Card>
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <span className="text-sm text-zinc-500">Ticket #{ticket.id}</span>
          <Badge variant={ticket.status} />
        </div>
        {ticket.description && (
          <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed">
            {ticket.description}
          </p>
        )}
        <div className="mt-4 border-t border-zinc-200 dark:border-zinc-800 pt-4 flex items-center gap-4 text-xs text-zinc-500">
          <span>Created {new Date(ticket.createdAt).toLocaleDateString()}</span>
          <span>Updated {new Date(ticket.updatedAt).toLocaleDateString()}</span>
        </div>
      </Card>

      <div>
        <h2 className="mb-4 text-lg font-semibold">
          Comments ({ticket.comments.length})
        </h2>

        {ticket.comments.length === 0 ? (
          <p className="text-sm text-zinc-500">No comments yet.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {ticket.comments.map((comment) => (
              <li key={comment.id}>
                <Card>
                  <p className="text-sm">{comment.text}</p>
                  <p className="mt-1 text-xs text-zinc-400">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </p>
                </Card>
              </li>
            ))}
          </ul>
        )}

        <Card className="mt-4">
          <CommentForm repositoryId={repo.id} ticketId={ticket.id} />
        </Card>
      </div>
    </>
  )
}
