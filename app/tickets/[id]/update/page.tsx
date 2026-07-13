import { notFound } from "next/navigation"
import { getTicketById, getRepository, getRepositories } from "@/lib/db"
import Header from "@/app/components/Header"
import Card from "@/app/components/Card"
import ConfirmDeleteButton from "@/app/components/ConfirmDeleteButton"
import { deleteTicketAction } from "@/app/actions"
import UpdateTicketForm from "@/app/components/UpdateTicketForm"

export default async function UpdateTicketPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: ticketId } = await params
  const ticket = getTicketById(ticketId)
  if (!ticket) notFound()

  const repository = getRepository(ticket.repositoryId)
  if (!repository) notFound()

  const repositories = getRepositories()

  return (
    <>
      <Header
        breadcrumbs={[
          { label: "Tickets", href: "/tickets" },
        ]}
        title="Update Ticket"
        actions={
          <ConfirmDeleteButton
            action={deleteTicketAction}
            hiddenFields={{ repositoryId: repository.id, ticketId: ticket.id }}
            title="Delete Ticket?"
            message="This will also delete all its comments. This action cannot be undone."
            label="Delete Ticket"
          />
        }
      />
      <Card>
        <UpdateTicketForm
          repositoryId={repository.id}
          ticketId={ticket.id}
          title={ticket.title}
          content={ticket.content}
          status={ticket.status}
          repositories={repositories}
        />
      </Card>
    </>
  )
}
