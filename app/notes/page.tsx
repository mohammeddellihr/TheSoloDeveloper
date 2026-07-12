import Link from "next/link"
import { getNotes } from "@/lib/db"
import Header from "@/app/components/Header"
import Card from "@/app/components/Card"
import Button from "@/app/components/Button"

export default function NotesListPage() {
  const notes = getNotes()

  return (
    <>
      <Header
        breadcrumbs={[{ label: "Dashboard", href: "/" }]}
        title="Notes"
        actions={
          <Link href="/notes/create">
            <Button>Create Note</Button>
          </Link>
        }
      />

      {notes.length === 0 ? (
        <Card>
          <p className="text-center text-sm text-gray-500">No notes found.</p>
        </Card>
      ) : (
        <ul className="flex flex-col gap-2">
          {notes.map((note) => (
            <li key={note.id}>
              <Link href={`/note/${note.id}`} className="cursor-pointer hover:opacity-80">
                <Card>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{note.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        Created {new Date(note.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {note.keywords.length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {note.keywords.map((keyword) => (
                        <span key={keyword} className="inline-flex items-center rounded bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-300">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}
                  {note.content && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2 whitespace-pre-wrap">
                      {note.content}
                    </p>
                  )}
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
