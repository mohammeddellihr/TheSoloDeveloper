import Link from "next/link"
import { getNotes } from "@/lib/db"
import Header from "@/app/components/Header"
import Card from "@/app/components/Card"
import Button from "@/app/components/Button"
import NoteSearch from "@/app/components/NoteSearch"
import CopyContentButton from "@/app/components/CopyContentButton"

export default async function NotesListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const term = (q ?? "").toLowerCase().trim()
  const allNotes = getNotes()
  const notes = term
    ? allNotes.filter(
        (note) =>
          note.keywords.some((k) => k.toLowerCase().includes(term)) ||
          note.title.toLowerCase().includes(term) ||
          note.content.toLowerCase().includes(term),
      )
    : allNotes

  return (
    <>
      <Header
        breadcrumbs={[{ label: "Dashboard", href: "/" }]}
        title="Notes"
        actions={
          <div className="flex items-center gap-2">
            <NoteSearch />
            <Link href="/notes/create">
              <Button>Create Note</Button>
            </Link>
          </div>
        }
      />

      {notes.length === 0 ? (
        <Card>
          <p className="text-center text-sm text-gray-500">No notes found.</p>
        </Card>
      ) : (
        <ul className="grid grid-cols-3 gap-2">
          {notes.map((note) => (
            <li key={note.id}>
              <Link href={`/note/${note.id}`} className="cursor-pointer hover:opacity-80">
                <Card>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{note.title}</span>
                    <CopyContentButton content={note.content} />
                  </div>
                  {note.keywords.length > 0 && (
                    <div className="border-t border-gray-200 dark:border-gray-800 pt-3 mt-3 flex gap-2 flex-wrap">
                      {note.keywords.map((keyword) => (
                        <span key={keyword} className="inline-flex items-center rounded bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-300">
                          {keyword}
                        </span>
                      ))}
                    </div>
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
