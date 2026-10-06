import { useState } from 'react'
import { useCompanies } from '../../hooks/useCompanies'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'
import { CompanyTable } from './CompanyTable'
import { SearchIcon } from '../ui/icons'
import { Pagination } from '../ui/Pagination'

const PAGE_SIZE_OPTIONS = [10, 20, 50]

interface CompanyListProps {
  selectedId: number | null
  onSelect: (id: number) => void
}

export function CompanyList({ selectedId, onSelect }: CompanyListProps) {
  const [search, setSearch] = useState('')
  const fulltext = useDebouncedValue(search.trim())
  const [pageSize, setPageSize] = useState(20)

  // Stránku si ukládám i s hledáním, ke kterému patří. Když se hledání změní, vyjde page = 0
  // a do API jde nové hledání i stránka najednou. Přes useEffect by odešly dva požadavky.
  const [paging, setPaging] = useState({ fulltext, page: 0 })
  const page = paging.fulltext === fulltext ? paging.page : 0
  const setPage = (newPage: number) => setPaging({ fulltext, page: newPage })

  const { data, isPending, isFetching, error } = useCompanies({
    offset: page * pageSize,
    limit: pageSize,
    fulltext,
    sortColumn: 'name',
    sortDirection: 'ASC',
  })

  return (
    // výška okna jen na xl, kde je detail vedle (patička dole jako v Raynetu)
    // na užších je detail pod tabulkou a vznikla by mezi tabulkou a patičkou díra
    <section className="flex min-w-0 flex-col gap-4 xl:min-h-[calc(100vh-2.75rem-1rem)]">
      <header className="flex min-h-12 flex-wrap items-center gap-x-6 gap-y-2">
        <h1 className="text-[28px] font-light text-raynet-text">Klienti</h1>
        <label className="relative">
          <span className="sr-only">Hledat klienta</span>
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-raynet-muted" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Hledat..."
            className="h-7.5 w-40 max-w-full rounded-full border border-raynet-border bg-white pr-3 pl-7 text-xs outline-none placeholder:text-raynet-muted focus:border-raynet-blue focus:ring-2 focus:ring-raynet-blue/20"
          />
        </label>
      </header>

      {error ? (
        <p className="rounded-md bg-red-50 p-4 text-sm text-red-700">{error.message}</p>
      ) : (
        <div className="flex flex-1 flex-col">
          <CompanyTable
            companies={data?.data ?? []}
            isLoading={isPending}
            isEmpty={data?.data.length === 0}
            isRefreshing={isFetching && !isPending}
            selectedId={selectedId}
            onSelect={onSelect}
          />
          <Pagination
            page={page}
            pageSize={pageSize}
            pageSizeOptions={PAGE_SIZE_OPTIONS}
            totalCount={data?.totalCount ?? 0}
            onPageChange={setPage}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize)
              setPage(0)
            }}
          />
        </div>
      )}
    </section>
  )
}
