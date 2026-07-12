import { notFound } from "next/navigation"
import { getRepository, getTicket } from "@/lib/db"
import Header from "@/app/components/Header"
import Card from "@/app/components/Card"
import DeleteTicketButton from "@/app/components/DeleteTicketButton"
import UpdateTicketForm from "@/app/components/UpdateTicketForm"

export default async function UpdateTicketPage({
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
          { label: `Update Ticket #${ticket.id}` },
        ]}
        actions={<DeleteTicketButton repositoryId={repo.id} ticketId={ticket.id} />}
      />
      <Card>
        <h1 className="text-xl font-bold border-b border-zinc-200 dark:border-zinc-800 pb-4">Update Ticket</h1>
        <div className="pt-4">
          <UpdateTicketForm
            repositoryId={repo.id}
            ticketId={ticket.id}
            title={ticket.title}
            description={ticket.description}
            status={ticket.status}
          />
        </div>
      </Card>
    </>
  )
}
