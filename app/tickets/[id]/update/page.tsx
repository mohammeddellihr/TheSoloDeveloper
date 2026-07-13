import { notFound } from "next/navigation"
import { getTicketById, getRepository, getRepositories } from "@/lib/db"
import Header from "@/app/components/Header"
import Card from "@/app/components/Card"
import DeleteTicketButton from "@/app/components/DeleteTicketButton"
import UpdateTicketForm from "@/app/components/UpdateTicketForm"

export default async function UpdateTicketPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: ticketId } = await params
  const ticket = getTicketById(ticketId)
  if (!ticket) notFound()

  const repo = getRepository(ticket.repositoryId)
  if (!repo) notFound()

  const repositories = getRepositories()

  return (
    <>
      <Header
        breadcrumbs={[
          { label: "Tickets", href: "/tickets" },
        ]}
        title="Update Ticket"
        actions={<DeleteTicketButton repositoryId={repo.id} ticketId={ticket.id} />}
      />
      <Card>
        <UpdateTicketForm
          repositoryId={repo.id}
          ticketId={ticket.id}
          title={ticket.title}
          description={ticket.description}
          status={ticket.status}
          repositories={repositories}
        />
      </Card>
    </>
  )
}
