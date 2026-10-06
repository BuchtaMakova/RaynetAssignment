import { useQuery } from '@tanstack/react-query'
import { getCompany } from '../api/companies'

export function useCompany(id: number | null) {
  return useQuery({
    queryKey: ['company', id],
    queryFn: ({ signal }) => getCompany(id!, signal),
    enabled: id !== null,
  })
}
