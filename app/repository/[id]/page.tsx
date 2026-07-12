import Link from "next/link"
import { notFound } from "next/navigation"
import { getRepository, getTickets } from "@/lib/db"
import TicketList from "./TicketList"

export default async function RepoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const repo = getRepository(id)
  const tickets = getTickets(id)

  if (!repo) notFound()

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-12">
      <div>
        <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
          &larr; Repositories
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">{repo.name}</h1>
        <a
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          {repo.url}
        </a>
      </div>

      <TicketList tickets={tickets} repoId={repo.id} />
    </div>
  )
}
