import Link from "next/link"
import { notFound } from "next/navigation"
import { getRepository, getTickets } from "@/lib/db"
import Header from "@/app/components/Header"
import Card from "@/app/components/Card"
import Button from "@/app/components/Button"
import TicketList from "./TicketList"

export default async function RepoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const repo = getRepository(id)
  if (!repo) notFound()
  const tickets = getTickets(id)

  return (
    <>
      <Header
        breadcrumbs={[{ label: "Repositories", href: "/repositories" }]}
        title={`Repository #${repo.id}`}
        actions={
          <>
            <Link href={`/repository/${repo.id}/update`}>
              <Button variant="secondary">Update</Button>
            </Link>
            <Link href={`/repository/${repo.id}/ticket/create`}>
              <Button variant="primary">Create Ticket</Button>
            </Link>
          </>
        }
      />

      <Card>
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
          <h1 className="text-xl font-bold">{repo.name}</h1>
        </div>
        {repo.url && (
          <div className="pt-4">
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline dark:text-blue-400 cursor-pointer"
            >
              {repo.url}
            </a>
          </div>
        )}
      </Card>

      <TicketList tickets={tickets} repositoryId={repo.id} />
    </>
  )
}
