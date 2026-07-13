"use client"

export default function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col rounded border border-gray-800 bg-black p-4 ${className || ""}`}>
      {children}
    </div>
  )
}
