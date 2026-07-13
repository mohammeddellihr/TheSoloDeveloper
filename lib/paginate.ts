const DEFAULT_PAGE_SIZE = 12

export function paginate<T>(
  items: T[],
  page: number | string | undefined,
  pageSize: number = DEFAULT_PAGE_SIZE,
): { items: T[]; currentPage: number; totalPages: number } {
  const currentPage = Math.max(1, Number(page) || 1)
  const totalPages = Math.ceil(items.length / pageSize)
  const sliced = items.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  return { items: sliced, currentPage, totalPages }
}
