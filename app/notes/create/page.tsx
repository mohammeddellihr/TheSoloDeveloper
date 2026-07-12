import Header from "@/app/components/Header"
import CreateNoteForm from "@/app/components/CreateNoteForm"

export default function CreateNotePage() {
  return (
    <div className="flex flex-col gap-6">
      <Header
        title="Create Note"
        breadcrumbs={[{ label: "Notes", href: "/notes" }]}
      />
      <CreateNoteForm />
    </div>
  )
}
