import Link from "next/link"
import { notFound } from "next/navigation"
import { getRepository, getTickets } from "@/lib/db"
import Header from "@/app/components/Header"
import Card from "@/app/components/Card"
import Button from "@/app/components/Button"
import TicketList from "./TicketList"

export default async function RepoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const repository = getRepository(id)
  if (!repository) notFound()
  const tickets = getTickets(id)

  return (
    <>
      <Header
        breadcrumbs={[{ label: "Repositories", href: "/repositories" }]}
        title={`Repository #${repository.id}`}
        actions={
          <>
            <Link href={`/tickets/create?repository_id=${repository.id}`}>
              <Button variant="secondary">Create Ticket</Button>
            </Link>
            <Link href={`/repositories/${repository.id}/update`}>
              <Button>Update Repository</Button>
            </Link>
          </>
        }
      />

      <Card>
        <div className="-mx-4 px-4 pb-4 border-b border-gray-800 flex items-center justify-between">
          <h1 className="text-xl font-bold">{repository.name}</h1>
        </div>
        {repository.url ? (
          <div className="pt-4">
            <a
              href={repository.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-400 hover:underline cursor-pointer"
            >
              {repository.url}
            </a>
          </div>
        ) : (
          <div className="pt-4">
            <p className="text-sm text-gray-400 italic">No content</p>
          </div>
        )}
      </Card>

      <TicketList tickets={tickets} />
    </>
  )
}
