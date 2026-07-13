export function iso(): string {
  return new Date().toISOString()
}

export function parseKeywords(raw: unknown): string[] {
  return typeof raw === "string" && raw.trim()
    ? raw.split(",").map(k => k.trim()).filter(Boolean)
    : []
}