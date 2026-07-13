import Link from "next/link"
import { getRepositories } from "@/lib/db"
import Header from "@/app/components/Header"
import Card from "@/app/components/Card"
import Button from "@/app/components/Button"
import SourceBadge from "@/app/components/SourceBadge"
import ExternalLinkButton from "@/app/components/ExternalLinkButton"
import Pagination from "@/app/components/Pagination"
import { paginate } from "@/lib/paginate"

export default async function RepositoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page } = await searchParams
  const { items: repositories, currentPage, totalPages } = paginate(getRepositories(), page)

  return (
    <>
      <Header
        breadcrumbs={[{ label: "Dashboard", href: "/" }]}
        title="Repositories"
        actions={
          <Link href="/repositories/create">
            <Button variant="primary">Create Repository</Button>
          </Link>
        }
      />

      {repositories.length === 0 ? (
        <Card>
          <p className="text-center text-sm text-gray-400">No repositories yet.</p>
        </Card>
      ) : (
        <ul className="grid grid-cols-3 gap-2">
          {repositories.map((repository) => (
            <li key={repository.id}>
              <Card>
                <div className="flex items-center justify-between">
                  <Link href={`/repositories/${repository.id}`} className="font-medium hover:underline cursor-pointer">
                    {repository.name}
                  </Link>
                  <div className="flex items-center gap-2">
                    <SourceBadge url={repository.url} />
                    {repository.url && <ExternalLinkButton url={repository.url} />}
                  </div>
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
