"use client"

import { useRef, useState } from "react"
import { useActionState } from "react"
import ConfirmModal from "@/app/components/ConfirmModal"

export default function ConfirmDeleteButton({
  action,
  hiddenFields,
  title,
  message,
  label,
  variant = "full",
}: {
  action: (prev: unknown, formData: FormData) => Promise<{ error?: string | null } | undefined | void>
  hiddenFields: Record<string, string>
  title: string
  message: string
  label: string
  variant?: "full" | "icon"
}) {
  const [state, formAction, pending] = useActionState(action, null as { error?: string | null } | null)
  const [modalOpen, setModalOpen] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  function handleConfirm() {
    setModalOpen(false)
    formRef.current?.requestSubmit()
  }

  return (
    <>
      <form ref={formRef} action={formAction}>
        {Object.entries(hiddenFields).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} />
        ))}
        {state && "error" in state && state.error ? (
          <p className="text-sm text-red-500">{state.error}</p>
        ) : null}
        {variant === "full" ? (
          <button
            type="button"
            disabled={pending}
            onClick={() => setModalOpen(true)}
            className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50 cursor-pointer"
          >
            {pending ? "Deleting..." : label}
          </button>
        ) : (
          <button
            type="button"
            disabled={pending}
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              setModalOpen(true)
            }}
            className="rounded p-1 text-gray-400 hover:text-red-400 disabled:opacity-50 cursor-pointer"
            aria-label={label}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
          </button>
        )}
      </form>
      <ConfirmModal
        open={modalOpen}
        title={title}
        message={message}
        onConfirm={handleConfirm}
        onCancel={() => setModalOpen(false)}
      />
    </>
  )
}
