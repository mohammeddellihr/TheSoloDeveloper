import { notFound } from "next/navigation"
import { getRepository } from "@/lib/db"
import Header from "@/app/components/Header"
import Card from "@/app/components/Card"
import ConfirmDeleteButton from "@/app/components/ConfirmDeleteButton"
import { deleteRepositoryAction } from "@/app/actions"
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
        actions={
          <ConfirmDeleteButton
            action={deleteRepositoryAction}
            hiddenFields={{ repositoryId: repository.id }}
            title="Delete Repository?"
            message="This will also delete all its tickets and comments. This action cannot be undone."
            label="Delete Repository"
          />
        }
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
