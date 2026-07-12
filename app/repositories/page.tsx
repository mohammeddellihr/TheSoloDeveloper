import Link from "next/link"
import { getRepositories } from "@/lib/db"
import Header from "@/app/components/Header"
import Card from "@/app/components/Card"
import Button from "@/app/components/Button"

export default async function RepositoriesPage() {
  const repos = getRepositories()

  return (
    <>
      <Header
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Repositories" },
        ]}
        actions={
          <Link href="/repository/new">
            <Button variant="primary">Create Repository</Button>
          </Link>
        }
      />

      {repos.length === 0 ? (
        <p className="text-sm text-zinc-500">No repositories yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {repos.map((repo) => (
            <li key={repo.id}>
              <Link href={`/repository/${repo.id}`} className="cursor-pointer hover:opacity-80">
                <Card>
                  <span className="font-medium">{repo.name}</span>
                  {repo.url && <span className="ml-2 text-sm text-zinc-500">{repo.url}</span>}
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
