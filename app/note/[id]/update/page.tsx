import { notFound } from "next/navigation"
import { getNote } from "@/lib/db"
import Header from "@/app/components/Header"
import Card from "@/app/components/Card"
import UpdateNoteForm from "@/app/components/UpdateNoteForm"
import DeleteNoteButton from "@/app/components/DeleteNoteButton"

export default async function UpdateNotePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const note = getNote(Number(id))

  if (!note) notFound()

  return (
    <>
      <Header
        title="Update Note"
        breadcrumbs={[
          { label: "Notes", href: "/notes" },
          { label: note.title, href: `/note/${note.id}` },
        ]}
        actions={<DeleteNoteButton noteId={note.id} />}
      />
      <Card>
        <UpdateNoteForm note={note} />
      </Card>
    </>
  )
}
