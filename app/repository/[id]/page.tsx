import Link from "next/link"
import { notFound } from "next/navigation"
import { getRepository, getTickets } from "@/lib/db"
import Header from "@/app/components/Header"
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
        breadcrumbs={[
          { label: "Repositories", href: "/repositories" },
          { label: `View Repository #${repo.id}` },
        ]}
        actions={
          <>
            <Link href={`/repository/${repo.id}/update`}>
              <Button variant="secondary">Update</Button>
            </Link>
            <Link href={`/repository/${repo.id}/ticket/new`}>
              <Button variant="primary">New Ticket</Button>
            </Link>
          </>
        }
      />
      {repo.url && (
        <a
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          {repo.url}
        </a>
      )}
      <TicketList tickets={tickets} repositoryId={repo.id} />
    </>
  )
}
