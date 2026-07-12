import { notFound } from "next/navigation"
import { getNote } from "@/lib/db"
import Header from "@/app/components/Header"
import Card from "@/app/components/Card"
import Button from "@/app/components/Button"
import Link from "next/link"
import { formatDate } from "@/lib/utils"

export default async function ViewNotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const note = getNote(Number(id))

  if (!note) notFound()

  return (
    <div className="flex flex-col gap-6">
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
        <Card className="p-6">
          {note.keywords.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-4">
              {note.keywords.map((keyword) => (
                <span key={keyword} className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-300">
                  {keyword}
                </span>
              ))}
            </div>
          )}
          {note.content ? (
            <p className="whitespace-pre-wrap">{note.content}</p>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic">No content</p>
          )}
        </Card>
        <Card className="border-t p-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
          <span>Created {formatDate(note.createdAt)}</span>
          <span>Updated {formatDate(note.updatedAt)}</span>
        </Card>
      </Card>
    </div>
  )
}
