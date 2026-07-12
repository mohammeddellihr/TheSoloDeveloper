import Link from "next/link"
import { notFound } from "next/navigation"
import { getRepository, getTicket } from "@/lib/db"
import Header from "@/app/components/Header"
import Card from "@/app/components/Card"
import Badge from "@/app/components/Badge"
import Button from "@/app/components/Button"
import CopyContentButton from "@/app/components/CopyContentButton"
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
        title={`Ticket #${ticket.id}`}
        actions={
          <Link href={`/repository/${repo.id}/ticket/${ticket.id}/update`}>
            <Button>Update Ticket</Button>
          </Link>
        }
      />

      <Card>
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
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
            <p className="text-sm text-gray-500 italic">No content</p>
          </div>
        )}
      </Card>

      <div className="flex flex-col gap-3">
        {ticket.comments.map((comment) => (
          <Card key={comment.id}>
            <div className="flex items-start justify-between">
              <p className="text-sm whitespace-pre-wrap">{comment.text}</p>
              <CopyContentButton content={comment.text} />
            </div>
          </Card>
        ))}

        <Card>
          <CommentForm repositoryId={repo.id} ticketId={ticket.id} />
        </Card>
      </div>
    </>
  )
}
