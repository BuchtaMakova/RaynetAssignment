import { apiGet, type ListResponse } from './client'

// Číselníky mají v Raynetu obecná pole. U kategorií je v code01 název a v code02 barva (hex bez #).
export interface CompanyCategory {
  id: number
  code01: string
  code02: string | null
}

export function getCompanyCategories(signal?: AbortSignal) {
  return apiGet<ListResponse<CompanyCategory>>('/companyCategory/', undefined, signal)
}
