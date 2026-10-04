import type { ReactNode } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from './icons'

interface PaginationProps {
  page: number
  pageSize: number
  pageSizeOptions: number[]
  totalCount: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export function Pagination({ page, pageSize, pageSizeOptions, totalCount, onPageChange, onPageSizeChange }: PaginationProps) {
  const pageCount = Math.max(1, Math.ceil(totalCount / pageSize))

  return (
    <footer className="sticky bottom-0 mt-auto flex min-h-11 flex-wrap items-center justify-between gap-3 bg-white px-4 py-2 text-xs">
      <p className="flex items-baseline gap-2">
        <Label>Počet</Label>
        <span className="font-bold">{totalCount}</span>
      </p>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <label className="flex items-center gap-2 text-raynet-muted">
          Na stránce
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="cursor-pointer rounded bg-transparent font-bold text-raynet-text outline-none focus-visible:ring-2 focus-visible:ring-raynet-blue/30"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size} položek
              </option>
            ))}
          </select>
        </label>

        <span className="flex items-center gap-2 text-raynet-muted">
          Stránka
          <span className="inline-flex h-6 min-w-8 items-center justify-end rounded border border-raynet-border px-2 text-raynet-text">
            {page + 1}
          </span>
          <span className="font-bold text-raynet-text">z {pageCount}</span>
        </span>

        <div className="flex gap-1">
          <PageButton label="Předchozí stránka" disabled={page === 0} onClick={() => onPageChange(page - 1)}>
            <ChevronLeftIcon className="size-3.5" />
          </PageButton>
          <PageButton label="Další stránka" disabled={page + 1 >= pageCount} onClick={() => onPageChange(page + 1)}>
            <ChevronRightIcon className="size-3.5" />
          </PageButton>
        </div>
      </div>
    </footer>
  )
}

function Label({ children }: { children: string }) {
  return <span className="text-[11px] text-raynet-muted uppercase">{children}</span>
}

interface PageButtonProps {
  label: string
  disabled: boolean
  onClick: () => void
  children: ReactNode
}

function PageButton({ label, disabled, onClick, children }: PageButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex size-6 items-center justify-center rounded bg-raynet-page text-raynet-text hover:bg-raynet-border disabled:cursor-default disabled:text-raynet-muted/50 disabled:hover:bg-raynet-page"
    >
      {children}
    </button>
  )
}
