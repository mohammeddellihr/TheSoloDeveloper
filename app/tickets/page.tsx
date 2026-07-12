import Link from "next/link"
import { getAllTickets, getRepositories } from "@/lib/db"
import Header from "../components/Header"
import Card from "../components/Card"
import Badge from "../components/Badge"
import TicketFilters from "../components/TicketFilters"
import Button from "../components/Button"
import Pagination from "../components/Pagination"

const PAGE_SIZE = 12

export default async function TicketsPage({
  searchParams,
}: {
  searchParams: Promise<{ repository_id?: string; status?: string; page?: string }>
}) {
  const params = await searchParams
  const repositories = getRepositories()
  const allTickets = getAllTickets({
    repositoryId: params.repository_id || undefined,
    status: params.status || undefined,
  })
  const currentPage = Math.max(1, Number(params.page) || 1)
  const totalPages = Math.ceil(allTickets.length / PAGE_SIZE)
  const tickets = allTickets.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <>
      <Header
        breadcrumbs={[{ label: "Dashboard", href: "/" }]}
        title="Tickets"
        actions={
          <div className="flex items-center gap-2">
            <TicketFilters repositories={repositories} />
            <Link href="/tickets/create">
              <Button>Create Ticket</Button>
            </Link>
          </div>
        }
      />

      {tickets.length === 0 ? (
        <Card>
          <p className="text-center text-sm text-gray-500">No tickets found.</p>
        </Card>
      ) : (
        <ul className="grid grid-cols-3 gap-2">
          {tickets.map((ticket) => (
            <li key={ticket.id} className="h-full">
              <Card className="h-full">
                <div className="-mx-4 px-4 pb-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                  <Link href={`/repository/${ticket.repositoryId}/ticket/${ticket.id}`} className="font-medium hover:underline cursor-pointer line-clamp-1">
                    {ticket.title}
                  </Link>
                  <span className="text-sm text-gray-500 line-clamp-1">{ticket.repoName}</span>
                </div>
                {ticket.description ? (
                  <p className="pt-3 text-sm leading-relaxed whitespace-pre-wrap line-clamp-2">
                    {ticket.description}
                  </p>
                ) : (
                  <p className="pt-3 text-sm text-gray-500 italic">No description</p>
                )}
                <div className="-mx-4 px-4 pt-3 mt-3 border-t border-gray-200 dark:border-gray-800 flex gap-2">
                  <Badge variant={ticket.status} />
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </>
  )
}
