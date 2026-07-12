import Header from "@/app/components/Header"
import Card from "@/app/components/Card"
import CreateNoteForm from "@/app/components/CreateNoteForm"

export default function CreateNotePage() {
  return (
    <>
      <Header
        breadcrumbs={[{ label: "Notes", href: "/notes" }]}
        title="Create Note"
      />
      <Card>
        <h1 className="text-xl font-bold border-b border-gray-200 dark:border-gray-800 pb-4">Create Note</h1>
        <div className="pt-4">
          <CreateNoteForm />
        </div>
      </Card>
    </>
  )
}
