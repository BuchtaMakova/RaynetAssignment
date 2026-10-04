import type { KeyboardEvent, ReactNode } from 'react'
import { COMPANY_ROLE_LABELS, type Company } from '../api/companies'
import { CategoryBadge, OwnerName, StateText } from './CompanyBadges'

interface Column {
  label: string
  // px, tabulka se schválně neroztahuje přes celou šířku (stejně jako v Raynetu)
  width: number
  align?: 'center'
}

// sloupce podle wireframu, šířky jsem odkoukal z Raynetu
const COLUMNS: Column[] = [
  { label: 'Název/jméno', width: 260 },
  { label: 'Stav', width: 100 },
  { label: 'Vztah', width: 120 },
  { label: 'Rating', width: 64, align: 'center' },
  { label: 'Vlastník', width: 170 },
  { label: 'IČ', width: 100 },
  { label: 'Město', width: 140 },
  { label: 'Kategorie', width: 120 },
]
const TABLE_WIDTH = COLUMNS.reduce((sum, column) => sum + column.width, 0)
const GRID_COLUMNS = COLUMNS.map((column) => `${column.width}px`).join(' ')

interface CompanyTableProps {
  companies: Company[]
  isLoading: boolean
  isEmpty: boolean
  isRefreshing: boolean
  selectedId: number | null
  onSelect: (id: number) => void
}

// Není to <table>, protože <tr> neumí border-radius ani box-shadow, které mají řádky v Raynetu.
// Role table/row/cell nechávám kvůli čtečkám obrazovky.
export function CompanyTable({ companies, isLoading, isEmpty, isRefreshing, selectedId, onSelect }: CompanyTableProps) {
  return (
    <div className="overflow-x-auto">
      <div
        role="table"
        aria-label="Klienti"
        // +8 px kvůli p-1, jinak overflow-x-auto ořízne stín krajních řádků
        style={{ width: TABLE_WIDTH + 8 }}
        className={`p-1 text-[13px] transition-opacity ${isRefreshing ? 'opacity-60' : ''}`}
      >
        <div role="rowgroup">
          <div role="row" className="grid h-7 items-center" style={{ gridTemplateColumns: GRID_COLUMNS }}>
            {COLUMNS.map((column) => (
              <div
                key={column.label}
                role="columnheader"
                className={`px-3 text-[11px] font-medium whitespace-nowrap text-raynet-heading uppercase first:pl-4 ${
                  column.align === 'center' ? 'text-center' : ''
                }`}
              >
                {column.label}
              </div>
            ))}
          </div>
        </div>

        <div role="rowgroup" className="flex flex-col gap-0.5">
          {isLoading && <MessageRow>Načítám klienty…</MessageRow>}
          {isEmpty && <MessageRow>Žádný klient neodpovídá hledání.</MessageRow>}
          {companies.map((company) => (
            <CompanyRow
              key={company.id}
              company={company}
              selected={company.id === selectedId}
              onSelect={() => onSelect(company.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function CompanyRow({ company, selected, onSelect }: { company: Company; selected: boolean; onSelect: () => void }) {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect()
    }
  }

  return (
    <div
      role="row"
      tabIndex={0}
      aria-selected={selected}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      style={{ gridTemplateColumns: GRID_COLUMNS }}
      // styl podle .xTableBody__row z Raynetu
      className="grid h-7.5 cursor-pointer items-center rounded bg-white shadow-raynet-card outline-none hover:bg-raynet-row-hover focus-visible:ring-2 focus-visible:ring-raynet-blue/40 aria-selected:bg-raynet-selected"
    >
      <Cell className="pl-4 font-medium">{company.name}</Cell>
      <Cell>
        <StateText state={company.state} />
      </Cell>
      <Cell className="text-raynet-heading">{COMPANY_ROLE_LABELS[company.role] ?? company.role}</Cell>
      <Cell className="text-center text-raynet-heading">{company.rating}</Cell>
      <Cell className="font-medium">{company.owner && <OwnerName owner={company.owner} />}</Cell>
      <Cell className="text-raynet-heading tabular-nums">{company.regNumber}</Cell>
      <Cell className="text-raynet-heading">{company.primaryAddress?.address.city}</Cell>
      <Cell>
        <CategoryBadge category={company.category} />
      </Cell>
    </div>
  )
}

function Cell({ children, className = '' }: { children?: ReactNode; className?: string }) {
  return (
    <div role="cell" className={`min-w-0 overflow-hidden px-3 text-ellipsis whitespace-nowrap ${className}`}>
      {children}
    </div>
  )
}

function MessageRow({ children }: { children: string }) {
  return (
    <div role="row" className="rounded bg-white px-4 py-10 text-center text-raynet-muted shadow-raynet-card">
      <div role="cell">{children}</div>
    </div>
  )
}
