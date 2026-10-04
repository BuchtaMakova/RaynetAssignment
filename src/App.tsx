import { useState } from 'react'
import { CompanyDetail } from './components/CompanyDetail'
import { CompanyList } from './components/CompanyList'
import { AppLayout } from './components/layout/AppLayout'

function App() {
  const [selectedId, setSelectedId] = useState<number | null>(null)

  return (
    <AppLayout>
      {/* tabulka má pevnou šířku, když se nevejde, scrolluje se do strany */}
      <div className="grid gap-6 pb-6 xl:grid-cols-[minmax(0,max-content)_380px] xl:pb-0">
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
