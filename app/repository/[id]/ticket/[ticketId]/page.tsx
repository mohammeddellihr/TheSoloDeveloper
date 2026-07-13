import Link from "next/link"
import { notFound } from "next/navigation"
import { getRepository, getTicket } from "@/lib/db"
import Header from "@/app/components/Header"
import Card from "@/app/components/Card"
import Badge from "@/app/components/Badge"
import Button from "@/app/components/Button"
import UpdateCommentButton from "@/app/components/UpdateCommentButton"
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
        breadcrumbs={[
          { label: "Tickets", href: "/tickets" },
        ]}
        title={`Ticket #${ticket.id}`}
        actions={
          <Link href={`/repository/${repo.id}/ticket/${ticket.id}/update`}>
            <Button>Update Ticket</Button>
          </Link>
        }
      />

      <Card>
        <div className="-mx-4 px-4 pb-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h1 className="text-xl font-bold">{ticket.title}</h1>
          <Badge variant={ticket.status} />
        </div>
        {ticket.description ? (
          <div className="pt-4">
            <p className="whitespace-pre-wrap text-sm leading-relaxed">
              {ticket.description}
            </p>
          </div>
        ) : (
          <div className="pt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">No content</p>
          </div>
        )}
      </Card>

      <div className="flex flex-col gap-2">
        {ticket.comments.map((comment) => (
          <UpdateCommentButton
            key={comment.id}
            repositoryId={repo.id}
            ticketId={ticket.id}
            commentId={comment.id}
            initialText={comment.text}
          />
        ))}

        <Card>
          <CommentForm repositoryId={repo.id} ticketId={ticket.id} />
        </Card>
      </div>
    </>
  )
}
