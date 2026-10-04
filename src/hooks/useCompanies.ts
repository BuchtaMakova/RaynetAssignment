import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getCompanies, type CompanyListParams } from '../api/companies'

export function useCompanies(params: CompanyListParams) {
  return useQuery({
    // parametry jsou v klíči, takže každá stránka / hledání má svoji cache
    queryKey: ['companies', params],
    // signal zruší požadavek, který už není potřeba
    queryFn: ({ signal }) => getCompanies(params, signal),
    // při stránkování nechávám stará data, dokud nepřijdou nová, ať to nebliká
    placeholderData: keepPreviousData,
  })
}
