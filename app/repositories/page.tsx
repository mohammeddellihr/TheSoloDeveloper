import Link from "next/link"
import { getRepositories } from "@/lib/db"
import Header from "@/app/components/Header"
import Card from "@/app/components/Card"
import Button from "@/app/components/Button"
import SourceBadge from "@/app/components/SourceBadge"

export default async function RepositoriesPage() {
  const repos = getRepositories()

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
          <p className="text-center text-sm text-gray-500">No repositories yet.</p>
        </Card>
      ) : (
        <ul className="flex flex-col gap-2">
          {repos.map((repo) => (
            <li key={repo.id}>
              <Link href={`/repository/${repo.id}`} className="cursor-pointer hover:opacity-80">
                <Card>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{repo.name}</span>
                    <SourceBadge url={repo.url} />
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
