"use client"

import Link from "next/link"

type Crumb = { label: string; href?: string }

export default function Header({
  breadcrumbs,
  title,
  actions,
}: {
  breadcrumbs: Crumb[]
  title: string
  actions?: React.ReactNode
}) {
  return (
    <div className="mb-6 space-y-1">
      <div className="flex items-center justify-between gap-4">
        <div>
          {breadcrumbs.length > 0 && (
            <nav className="text-sm text-zinc-400">
              {breadcrumbs.map((crumb, i) => (
                <span key={i}>
                  {i > 0 && <span className="mx-1.5">/</span>}
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="hover:text-zinc-600 dark:hover:text-zinc-300 cursor-pointer"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span>{crumb.label}</span>
                  )}
                </span>
              ))}
            </nav>
          )}
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  )
}
