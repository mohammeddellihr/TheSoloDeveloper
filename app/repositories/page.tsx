import Link from "next/link"
import { getRepositories } from "@/lib/db"
import Header from "@/app/components/Header"
import Card from "@/app/components/Card"
import Button from "@/app/components/Button"
import SourceBadge from "@/app/components/SourceBadge"
import ExternalLinkButton from "@/app/components/ExternalLinkButton"
import Pagination from "@/app/components/Pagination"

const PAGE_SIZE = 12

export default async function RepositoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page } = await searchParams
  const allRepos = getRepositories()
  const currentPage = Math.max(1, Number(page) || 1)
  const totalPages = Math.ceil(allRepos.length / PAGE_SIZE)
  const repos = allRepos.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <>
      <Header
        breadcrumbs={[{ label: "Dashboard", href: "/" }]}
        title="Repositories"
        actions={
          <Link href="/repository/create">
            <Button variant="primary">Create Repository</Button>
          </Link>
        }
      />

      {repos.length === 0 ? (
        <Card>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">No repositories yet.</p>
        </Card>
      ) : (
        <ul className="grid grid-cols-3 gap-2">
          {repos.map((repo) => (
            <li key={repo.id}>
              <Card>
                <div className="flex items-center justify-between">
                  <Link href={`/repository/${repo.id}`} className="font-medium hover:underline cursor-pointer">
                    {repo.name}
                  </Link>
                  <div className="flex items-center gap-2">
                    <SourceBadge url={repo.url} />
                    {repo.url && <ExternalLinkButton url={repo.url} />}
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
