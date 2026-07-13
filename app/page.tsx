import { getStats } from "@/lib/db"
import Header from "@/app/components/Header"
import Card from "@/app/components/Card"
import Link from "next/link"

export default function Dashboard() {
  const stats = getStats()

  const statCards = [
    { label: "Repositories", value: stats.totalRepositories, href: "/repositories" },
    { label: "Tickets", value: stats.totalTickets, href: "/tickets" },
    { label: "Notes", value: stats.totalNotes, href: "/notes" },
    { label: "Pending", value: stats.pending, href: "/tickets?status=pending", color: "text-orange-400" },
    { label: "In Progress", value: stats.inProgress, href: "/tickets?status=in_progress", color: "text-blue-400" },
    { label: "Completed", value: stats.completed, href: "/tickets?status=completed", color: "text-green-400" },
  ]

  return (
    <>
      <Header breadcrumbs={[]} title="Dashboard" />

      <div className="grid grid-cols-3 gap-4">
        {statCards.map((stat) => (
          <Link key={stat.label} href={stat.href} className="cursor-pointer hover:opacity-80">
            <Card>
              <p className="text-sm text-gray-400">{stat.label}</p>
              <p className={`mt-1 text-2xl font-bold ${stat.color || ""}`}>{stat.value}</p>
            </Card>
          </Link>
        ))}
      </div>
    </>
  )
}
