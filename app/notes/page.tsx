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
          <p className="text-center text-sm text-gray-400">No notes found.</p>
        </Card>
      ) : (
        <ul className="grid grid-cols-3 gap-2">
          {notes.map((note) => (
            <li key={note.id} className="h-full">
              <Card className="h-full">
                <div className="-mx-4 px-4 pb-4 border-b border-gray-800 flex items-center justify-between">
                  <Link href={`/notes/${note.id}`} className={note.title ? "font-medium hover:underline cursor-pointer line-clamp-1" : "font-medium hover:underline cursor-pointer line-clamp-1 text-gray-400"}>
                    {note.title || "No Title"}
                  </Link>
                  <CopyContentButton content={note.content} />
                </div>
                {note.content ? (
                  <p className="flex-1 pt-3 text-sm leading-relaxed whitespace-pre-wrap line-clamp-2">
                    {note.content}
                  </p>
                ) : (
                  <p className="flex-1 pt-3 text-sm text-gray-500">No content</p>
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
            </li>
          ))}
        </ul>
      )}
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </>
  )
}
