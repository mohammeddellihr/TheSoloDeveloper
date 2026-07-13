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
        <h1 className="text-xl font-bold -mx-4 px-4 pb-4 border-b border-gray-800">Create Note</h1>
        <div className="pt-4">
          <CreateNoteForm />
        </div>
      </Card>
    </>
  )
}
