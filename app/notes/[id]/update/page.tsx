import { notFound } from "next/navigation"
import { getNote } from "@/lib/db"
import Header from "@/app/components/Header"
import Card from "@/app/components/Card"
import UpdateNoteForm from "@/app/components/UpdateNoteForm"
import ConfirmDeleteButton from "@/app/components/ConfirmDeleteButton"
import { deleteNoteAction } from "@/app/actions"

export default async function UpdateNotePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const note = getNote(id)

  if (!note) notFound()

  return (
    <>
      <Header
        title="Update Note"
        breadcrumbs={[
          { label: "Notes", href: "/notes" },
          { label: note.title || "No Title", href: `/notes/${note.id}` },
        ]}
        actions={
          <ConfirmDeleteButton
            action={deleteNoteAction}
            hiddenFields={{ noteId: note.id }}
            title="Delete Note?"
            message="This note will be permanently deleted."
            label="Delete Note"
          />
        }
      />
      <Card>
        <UpdateNoteForm note={note} />
      </Card>
    </>
  )
}
