export default function SourceBadge({ url }: { url: string }) {
  const source = getSource(url)
  if (!source) return null
  return (
    <span className="inline-flex items-center rounded bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-300">
      {source}
    </span>
  )
}

function getSource(url: string): string | null {
  try {
    const hostname = new URL(url).hostname
    if (hostname === "github.com") return "github"
    if (hostname === "gitlab.com") return "gitlab"
    if (hostname === "bitbucket.org") return "bitbucket"
    return null
  } catch {
    return null
  }
}
