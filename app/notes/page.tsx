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
                  <span className="font-medium">{note.title}</span>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
