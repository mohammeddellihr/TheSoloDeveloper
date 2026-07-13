"use client"

export default function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col rounded border border-gray-200 bg-black p-4 dark:border-gray-800 ${className || ""}`}>
      {children}
    </div>
  )
}
