import Link from "next/link"
import { getRepositories } from "@/lib/db"
import CreateRepoForm from "./components/CreateRepoForm"

export default async function Home() {
  const repos = getRepositories()

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-12">
      <h1 className="text-2xl font-bold tracking-tight">Repositories</h1>

      <section className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-3 text-sm font-semibold text-zinc-600 dark:text-zinc-400">
          New Repository
        </h2>
        <CreateRepoForm />
      </section>

      {repos.length === 0 ? (
        <p className="text-sm text-zinc-500">No repositories yet. Create one above.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {repos.map((repo) => (
            <li key={repo.id}>
              <Link
                href={`/repository/${repo.id}`}
                className="block rounded-lg border border-zinc-200 p-4 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
              >
                <span className="font-medium">{repo.name}</span>
                <span className="ml-2 text-sm text-zinc-500">{repo.url}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
