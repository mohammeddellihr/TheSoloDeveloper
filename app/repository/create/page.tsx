import Header from "@/app/components/Header"
import Card from "@/app/components/Card"
import CreateRepoForm from "@/app/components/CreateRepoForm"

export default function NewRepositoryPage() {
  return (
    <>
      <Header
        breadcrumbs={[{ label: "Repositories", href: "/repositories" }]}
        title="Create Repository"
      />
      <Card>
        <CreateRepoForm />
      </Card>
    </>
  )
}
