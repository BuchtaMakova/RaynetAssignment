import { useState } from 'react'
import { CompanyDetail } from './components/companies/CompanyDetail'
import { CompanyList } from './components/companies/CompanyList'
import { AppLayout } from './components/layout/AppLayout'

function App() {
  const [selectedId, setSelectedId] = useState<number | null>(null)

  return (
    <AppLayout>
      {/* minmax(0, …) hlídá, aby obsah neroztáhl stránku – tabulka se pak scrolluje do strany
          a dlouhý název firmy v detailu se zalomí */}
      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 pb-6 xl:grid-cols-[minmax(0,max-content)_380px] xl:pb-0">
        <CompanyList selectedId={selectedId} onSelect={setSelectedId} />
        {/* mt-24 = hlavička + záhlaví tabulky, aby detail začínal na úrovni prvního řádku */}
        <div className="xl:sticky xl:top-5 xl:mt-24 xl:self-start">
          <CompanyDetail id={selectedId} />
        </div>
      </div>
    </AppLayout>
  )
}

export default App
