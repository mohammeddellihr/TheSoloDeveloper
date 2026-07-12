import Link from "next/link"
import { getAllTickets, getRepositories } from "@/lib/db"
import Header from "../components/Header"
import Card from "../components/Card"
import Badge from "../components/Badge"
import TicketFilters from "../components/TicketFilters"

export default async function TicketsPage({
  searchParams,
}: {
  searchParams: Promise<{ repository_id?: string; status?: string }>
}) {
  const params = await searchParams
  const repositories = getRepositories()
  const tickets = getAllTickets({
    repositoryId: params.repository_id || undefined,
    status: params.status || undefined,
  })

  return (
    <>
      <Header
        breadcrumbs={[{ label: "Dashboard", href: "/" }]}
        title="Tickets"
        actions={<TicketFilters repositories={repositories} />}
      />

      {tickets.length === 0 ? (
        <p className="text-sm text-gray-500">No tickets found.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {tickets.map((ticket) => (
            <li key={ticket.id}>
              <Link href={`/repository/${ticket.repositoryId}/ticket/${ticket.id}`} className="cursor-pointer hover:opacity-80">
                <Card>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{ticket.title}</span>
                      <span className="text-sm text-gray-500">in {ticket.repoName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={ticket.status} />
                      <span className="text-xs text-gray-400">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
