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
        breadcrumbs={[{ label: "Repositories", href: "/repositories" }]}
        title="Update Repository"
        actions={<DeleteRepoButton repositoryId={repo.id} />}
      />
      <Card>
        <UpdateRepoForm
          repositoryId={repo.id}
          url={repo.url}
        />
      </Card>
    </>
  )
}
