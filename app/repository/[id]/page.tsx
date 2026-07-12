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

      <Card>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">{repo.name}</h1>
          {repo.url && (
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline dark:text-blue-400 cursor-pointer"
            >
              {repo.url}
            </a>
          )}
        </div>
        <div className="mt-4 border-t border-zinc-200 dark:border-zinc-800 pt-4 flex items-center gap-4 text-xs text-zinc-500">
          <span>Created {new Date(repo.createdAt).toLocaleDateString()}</span>
          <span>Updated {new Date(repo.updatedAt).toLocaleDateString()}</span>
        </div>
      </Card>

      <TicketList tickets={tickets} repositoryId={repo.id} />
    </>
  )
}
