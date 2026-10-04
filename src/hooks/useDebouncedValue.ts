import { useEffect, useState } from 'react'

// vrátí hodnotu, až když se delay ms nezměnila (hledání se pošle až po dopsání)
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timeout)
  }, [value, delay])

  return debounced
}
