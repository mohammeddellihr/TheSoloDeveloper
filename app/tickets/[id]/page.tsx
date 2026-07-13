import Link from "next/link"
import { notFound } from "next/navigation"
import { getTicketById, getRepository } from "@/lib/db"
import Header from "@/app/components/Header"
import Card from "@/app/components/Card"
import Badge from "@/app/components/Badge"
import Button from "@/app/components/Button"
import CopyContentButton from "@/app/components/CopyContentButton"
import UpdateCommentButton from "@/app/components/UpdateCommentButton"
import CommentForm from "@/app/components/CommentForm"

export default async function TicketPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: ticketId } = await params
  const ticket = getTicketById(ticketId)
  if (!ticket) notFound()

  const repository = getRepository(ticket.repositoryId)
  if (!repository) notFound()

  return (
    <>
      <Header
        breadcrumbs={[
          { label: "Tickets", href: "/tickets" },
        ]}
        title={`Ticket #${ticket.id}`}
        actions={
          <Link href={`/tickets/${ticket.id}/update`}>
            <Button>Update Ticket</Button>
          </Link>
        }
      />

      <Card>
        <div className="-mx-4 px-4 pb-4 border-b border-gray-800 flex items-center justify-between">
          <h1 className={ticket.title ? "text-xl font-bold" : "text-xl font-bold text-gray-400"}>{ticket.title || "No Title"}</h1>
          <CopyContentButton content={ticket.content} />
        </div>
        {ticket.content ? (
          <div className="pt-4">
            <p className="whitespace-pre-wrap text-sm leading-relaxed">
              {ticket.content}
            </p>
          </div>
        ) : (
          <div className="pt-4">
            <p className="text-sm text-gray-400">No content</p>
          </div>
        )}
        <div className="-mx-4 px-4 pt-3 mt-3 border-t border-gray-800 flex items-center gap-2">
          <Link href={`/repositories/${repository.id}`} className="inline-flex items-center rounded bg-gray-800 px-2.5 py-0.5 text-xs font-medium text-gray-300 hover:underline">
            {repository.name}
          </Link>
          <Badge variant={ticket.status} />
        </div>
      </Card>

        <div className="flex flex-col gap-2">
          {ticket.comments.map((comment: { id: string; text: string }) => (
            <UpdateCommentButton
              key={comment.id}
              ownerType="ticket"
              ownerId={ticket.id}
              commentId={comment.id}
              initialText={comment.text}
            />
        ))}

        <Card>
          <CommentForm ownerType="ticket" ownerId={ticket.id} />
        </Card>
      </div>
    </>
  )
}
