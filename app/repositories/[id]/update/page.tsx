import { notFound } from "next/navigation"
import { getRepository } from "@/lib/db"
import Header from "@/app/components/Header"
import Card from "@/app/components/Card"
import DeleteRepositoryButton from "@/app/components/DeleteRepositoryButton"
import UpdateRepositoryForm from "@/app/components/UpdateRepositoryForm"

export default async function UpdateRepoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const repository = getRepository(id)
  if (!repository) notFound()

  return (
    <>
      <Header
        breadcrumbs={[{ label: "Repositories", href: "/repositories" }]}
        title="Update Repository"
        actions={<DeleteRepositoryButton repositoryId={repository.id} />}
      />
      <Card>
        <UpdateRepositoryForm
          repositoryId={repository.id}
          url={repository.url}
        />
      </Card>
    </>
  )
}
