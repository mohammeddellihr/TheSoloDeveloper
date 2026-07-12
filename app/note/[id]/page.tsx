import { notFound } from "next/navigation"
import { getNote } from "@/lib/db"
import Header from "@/app/components/Header"
import Card from "@/app/components/Card"
import Button from "@/app/components/Button"
import Link from "next/link"

export default async function ViewNotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const note = getNote(Number(id))

  if (!note) notFound()

  return (
    <>
      <Header
        title={note.title}
        breadcrumbs={[{ label: "Notes", href: "/notes" }]}
        actions={
          <Link href={`/note/${note.id}/update`}>
            <Button>Update Note</Button>
          </Link>
        }
      />

      <Card>
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
          <h1 className="text-xl font-bold">{note.title}</h1>
        </div>
        {note.content ? (
          <div className="pt-4">
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{note.content}</p>
          </div>
        ) : (
          <div className="pt-4">
            <p className="text-sm text-gray-500 italic">No content</p>
          </div>
        )}
        {note.keywords.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mt-4 flex gap-2 flex-wrap">
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
