"use client"

type ButtonProps = {
  variant?: "primary" | "secondary"
  children: React.ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const variants = {
  primary:
    "bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 disabled:opacity-50",
  secondary:
    "bg-white text-black border border-zinc-300 hover:bg-zinc-100 dark:bg-black dark:text-white dark:border-zinc-700 dark:hover:bg-zinc-800 disabled:opacity-50",
}

export default function Button({
  variant = "primary",
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`rounded px-4 py-2 text-sm font-medium cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:focus-visible:outline-white ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
