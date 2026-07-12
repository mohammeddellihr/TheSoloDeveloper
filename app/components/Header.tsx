"use client"

import Link from "next/link"

type Crumb = { label: string; href?: string }

export default function Header({
  breadcrumbs,
  actions,
}: {
  breadcrumbs: Crumb[]
  actions?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <nav className="flex items-center gap-1.5 text-sm text-zinc-500">
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-zinc-400">/</span>}
            {crumb.href ? (
              <Link href={crumb.href} className="hover:text-zinc-700 dark:hover:text-zinc-300">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-zinc-900 dark:text-zinc-100">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
