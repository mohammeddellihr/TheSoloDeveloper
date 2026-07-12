import { notFound } from "next/navigation"
import { getRepository } from "@/lib/db"
import Header from "@/app/components/Header"
import Card from "@/app/components/Card"
import CreateTicketForm from "@/app/components/CreateTicketForm"

export default async function NewTicketPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const repo = getRepository(id)
  if (!repo) notFound()

  return (
    <>
      <Header
        breadcrumbs={[{ label: "Tickets", href: "/tickets" }]}
        title="Create Ticket"
      />
      <Card>
        <h1 className="text-xl font-bold border-b border-zinc-200 dark:border-zinc-800 pb-4">Create Ticket</h1>
        <div className="pt-4">
          <CreateTicketForm repositoryId={repo.id} />
        </div>
      </Card>
    </>
  )
}
