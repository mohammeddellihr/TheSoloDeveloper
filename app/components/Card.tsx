"use client"

export default function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900 ${className || ""}`}>
      {children}
    </div>
  )
}
