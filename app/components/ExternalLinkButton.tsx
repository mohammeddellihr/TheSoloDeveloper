"use client"

export default function ExternalLinkButton({ url }: { url: string }) {
  function handleClick(e: React.MouseEvent) {
    e.stopPropagation()
    e.preventDefault()
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <button
      onClick={handleClick}
      className="rounded p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
      aria-label="Open repository"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
      >
        <path d="M15 3h6v6" />
        <path d="M10 14 21 3" />
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      </svg>
    </button>
  )
}
