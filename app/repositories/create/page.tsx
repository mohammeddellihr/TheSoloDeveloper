import Header from "@/app/components/Header"
import Card from "@/app/components/Card"
import CreateRepositoryForm from "@/app/components/CreateRepositoryForm"

export default function NewRepositoryPage() {
  return (
    <>
      <Header
        breadcrumbs={[{ label: "Repositories", href: "/repositories" }]}
        title="Create Repository"
      />
      <Card>
        <h1 className="text-xl font-bold -mx-4 px-4 pb-4 border-b border-gray-200 dark:border-gray-800">Create Repository</h1>
        <div className="pt-4">
          <CreateRepositoryForm />
        </div>
      </Card>
    </>
  )
}
