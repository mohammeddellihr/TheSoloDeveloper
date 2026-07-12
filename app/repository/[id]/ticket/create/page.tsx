import { notFound } from "next/navigation"
import { getRepository, getRepositories } from "@/lib/db"
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
  const repositories = getRepositories()

  return (
    <>
      <Header
        breadcrumbs={[{ label: "Tickets", href: "/tickets" }]}
        title="Create Ticket"
      />
      <Card>
        <h1 className="text-xl font-bold -mx-4 px-4 pb-4 border-b border-gray-200 dark:border-gray-800">Create Ticket</h1>
        <div className="pt-4">
          <CreateTicketForm repositories={repositories} defaultRepositoryId={repo.id} />
        </div>
      </Card>
    </>
  )
}
