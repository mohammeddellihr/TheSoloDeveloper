import { notFound } from "next/navigation"
import { getRepository } from "@/lib/db"
import Header from "@/app/components/Header"
import Card from "@/app/components/Card"
import DeleteRepoButton from "@/app/components/DeleteRepoButton"
import UpdateRepoForm from "@/app/components/UpdateRepoForm"

export default async function UpdateRepoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const repo = getRepository(id)
  if (!repo) notFound()

  return (
    <>
      <Header
        breadcrumbs={[
          { label: "Repositories", href: "/repositories" },
          { label: `Update Repository #${repo.id}` },
        ]}
        actions={<DeleteRepoButton repositoryId={repo.id} />}
      />
      <Card>
        <h1 className="text-xl font-bold border-b border-zinc-200 dark:border-zinc-800 pb-4">Update Repository</h1>
        <div className="pt-4">
          <UpdateRepoForm
            repositoryId={repo.id}
            name={repo.name}
            url={repo.url}
          />
        </div>
      </Card>
    </>
  )
}
