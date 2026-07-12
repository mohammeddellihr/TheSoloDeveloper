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
        <h1 className="text-xl font-bold border-b border-gray-200 dark:border-gray-800 pb-4">Create Repository</h1>
        <div className="pt-4">
          <CreateRepoForm />
        </div>
      </Card>
    </>
  )
}
