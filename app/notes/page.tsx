import Link from "next/link"
import { getNotes } from "@/lib/db"
import Header from "@/app/components/Header"
import Card from "@/app/components/Card"
import Button from "@/app/components/Button"
import NoteSearch from "@/app/components/NoteSearch"
import CopyContentButton from "@/app/components/CopyContentButton"
import Pagination from "@/app/components/Pagination"

const PAGE_SIZE = 12

export default async function NotesListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const { q, page } = await searchParams
  const term = (q ?? "").toLowerCase().trim()
  const allNotes = getNotes()
  const filtered = term
    ? allNotes.filter(
        (note) =>
          note.keywords.some((k) => k.toLowerCase().includes(term)) ||
          note.title.toLowerCase().includes(term) ||
          note.content.toLowerCase().includes(term),
      )
    : allNotes
  const currentPage = Math.max(1, Number(page) || 1)
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const notes = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

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
            <li key={note.id} className="h-full">
              <Card className="h-full">
                <div className="flex items-center justify-between">
                  <Link href={`/note/${note.id}`} className="font-medium hover:underline cursor-pointer">
                    {note.title}
                  </Link>
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
            </li>
          ))}
        </ul>
      )}
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </>
  )
}
