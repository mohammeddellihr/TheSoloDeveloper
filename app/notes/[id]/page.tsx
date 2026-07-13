import { notFound } from "next/navigation"
import { getNote } from "@/lib/db"
import Header from "@/app/components/Header"
import Card from "@/app/components/Card"
import Button from "@/app/components/Button"
import CopyContentButton from "@/app/components/CopyContentButton"
import Link from "next/link"

export default async function ViewNotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const note = getNote(id)

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
        <div className="-mx-4 px-4 pb-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h1 className="text-xl font-bold">{note.title}</h1>
          <CopyContentButton content={note.content} />
        </div>
        {note.content ? (
          <div className="pt-4">
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{note.content}</p>
          </div>
        ) : (
          <div className="pt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">No content</p>
          </div>
        )}
        {note.keywords.length > 0 && (
          <div className="-mx-4 px-4 pt-4 mt-4 border-t border-gray-200 dark:border-gray-800 flex gap-2 flex-wrap">
            {note.keywords.map((keyword) => (
              <span key={keyword} className="inline-flex items-center rounded bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-300">
                {keyword}
              </span>
            ))}
          </div>
        )}
      </Card>
    </>
  )
}
