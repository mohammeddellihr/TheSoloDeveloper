import { notFound } from "next/navigation"
import { getNoteWithComments } from "@/lib/db"
import Header from "@/app/components/Header"
import Card from "@/app/components/Card"
import Button from "@/app/components/Button"
import CopyContentButton from "@/app/components/CopyContentButton"
import UpdateNoteCommentButton from "@/app/components/UpdateNoteCommentButton"
import NoteCommentForm from "@/app/components/NoteCommentForm"
import Link from "next/link"

export default async function ViewNotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const note = getNoteWithComments(id)

  if (!note) notFound()

  return (
    <>
      <Header
        title={`Note #${note.id}`}
        breadcrumbs={[{ label: "Notes", href: "/notes" }]}
        actions={
          <Link href={`/notes/${note.id}/update`}>
            <Button>Update Note</Button>
          </Link>
        }
      />

      <Card>
        <div className="-mx-4 px-4 pb-4 border-b border-gray-800 flex items-center justify-between">
          <h1 className={note.title ? "text-xl font-bold" : "text-xl font-bold text-gray-400"}>{note.title || "No Title"}</h1>
          <CopyContentButton content={note.content} />
        </div>
        {note.content ? (
          <div className="pt-4">
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{note.content}</p>
          </div>
        ) : (
          <div className="pt-4">
            <p className="text-sm text-gray-400">No content</p>
          </div>
        )}
        {note.keywords.length > 0 && (
          <div className="-mx-4 px-4 pt-4 mt-4 border-t border-gray-800 flex gap-2 flex-wrap">
            {note.keywords.map((keyword) => (
              <span key={keyword} className="inline-flex items-center rounded bg-gray-800 px-2.5 py-0.5 text-xs font-medium text-gray-300">
                {keyword}
              </span>
            ))}
          </div>
        )}
      </Card>

      <div className="flex flex-col gap-2">
        {note.comments.map((comment) => (
          <UpdateNoteCommentButton
            key={comment.id}
            noteId={note.id}
            commentId={comment.id}
            initialText={comment.text}
          />
        ))}

        <Card>
          <NoteCommentForm noteId={note.id} />
        </Card>
      </div>
    </>
  )
}
