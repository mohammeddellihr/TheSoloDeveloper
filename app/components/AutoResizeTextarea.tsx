"use client"

import { useRef, useCallback, useEffect } from "react"

export default function AutoResizeTextarea({
  rows = 10,
  className,
  defaultValue,
  ...props
}: {
  rows?: number
  className?: string
  defaultValue?: string
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const ref = useRef<HTMLTextAreaElement>(null)

  const resize = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = el.scrollHeight + "px"
  }, [])

  useEffect(() => {
    if (defaultValue) resize()
  }, [defaultValue, resize])

  return (
    <textarea
      ref={ref}
      rows={rows}
      className={className}
      defaultValue={defaultValue}
      onInput={resize}
      {...props}
    />
  )
}
