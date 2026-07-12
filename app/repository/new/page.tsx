import Header from "@/app/components/Header"
import Card from "@/app/components/Card"
import CreateRepoForm from "@/app/components/CreateRepoForm"

export default function NewRepositoryPage() {
  return (
    <>
      <Header breadcrumbs={[{ label: "Repositories", href: "/repositories" }, { label: "Create Repository" }]} />
      <Card>
        <h1 className="text-xl font-bold border-b border-zinc-200 dark:border-zinc-800 pb-4">Create Repository</h1>
        <div className="pt-4">
          <CreateRepoForm />
        </div>
      </Card>
    </>
  )
}
