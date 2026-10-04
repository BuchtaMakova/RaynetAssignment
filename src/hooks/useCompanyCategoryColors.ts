import { useQuery } from '@tanstack/react-query'
import { getCompanyCategories } from '../api/codelists'

// mapa id kategorie -> barva pro štítky
export function useCompanyCategoryColors() {
  return useQuery({
    queryKey: ['companyCategories'],
    queryFn: ({ signal }) => getCompanyCategories(signal),
    // číselník se skoro nemění, stačí ho načíst jednou
    staleTime: Infinity,
    select: (response) =>
      new Map(response.data.map((category) => [category.id, category.code02 ? `#${category.code02}` : null])),
  })
}
