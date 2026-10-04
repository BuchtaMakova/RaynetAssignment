import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ApiError } from './api/client'
import './index.css'
import App from './App.tsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 30 s cache, Raynet má limit 24 000 požadavků denně
      staleTime: 30_000,
      // 401/403/429 nemá smysl opakovat (po 20 špatných loginech blokují IP), jinak jeden retry
      retry: (failureCount, error) =>
        !(error instanceof ApiError && [401, 403, 429].includes(error.status)) && failureCount < 1,
      refetchOnWindowFocus: false,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools />
    </QueryClientProvider>
  </StrictMode>,
)
