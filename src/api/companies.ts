import { apiGet, type DetailResponse, type ListResponse } from './client'

export type CompanyRole = 'A_SUBSCRIBER' | 'B_PARTNER' | 'C_SUPPLIER' | 'D_RIVAL' | 'E_OWN'
export type CompanyState = 'A_POTENTIAL' | 'B_ACTUAL' | 'C_DEFERRED' | 'D_UNATTRACTIVE'
export type CompanyRating = 'A' | 'B' | 'C'

export const COMPANY_ROLE_LABELS: Record<CompanyRole, string> = {
  A_SUBSCRIBER: 'Odběratel',
  B_PARTNER: 'Partner',
  C_SUPPLIER: 'Dodavatel',
  D_RIVAL: 'Konkurent',
  E_OWN: 'Vlastní firma',
}

export const COMPANY_STATE_LABELS: Record<CompanyState, string> = {
  A_POTENTIAL: 'Potenciální',
  B_ACTUAL: 'Aktuální',
  C_DEFERRED: 'Odložený',
  D_UNATTRACTIVE: 'Nezajímavý',
}

export interface Address {
  name: string | null
  street: string | null
  city: string | null
  zipCode: string | null
  country: string | null
  lat: number | null
  lng: number | null
}

export interface ContactInfo {
  email: string | null
  email2: string | null
  tel1: string | null
  tel2: string | null
  www: string | null
}

export interface CompanyAddress {
  id: number
  primary: boolean
  contactAddress: boolean
  address: Address
  contactInfo: ContactInfo
}

// Raynet vrací přes 40 polí, typuju jen ty, které opravdu používám
export interface Company {
  id: number
  name: string
  person: boolean
  role: CompanyRole
  state: CompanyState
  rating: CompanyRating | null
  owner: { id: number; fullName: string } | null
  regNumber: string | null
  taxNumber: string | null
  legalForm: { id: number; value: string } | null
  category: { id: number; value: string } | null
  primaryAddress: CompanyAddress | null
  notice: string | null
  tags: string[]
}

// detail má navíc všechny adresy a logo
export interface CompanyDetail extends Company {
  addresses: CompanyAddress[]
  employeesNumber: number | null
  logo: { id: number; contentType: string; fileName: string } | null
}

export interface CompanyListParams {
  offset: number
  limit: number
  fulltext?: string
  sortColumn?: string
  sortDirection?: 'ASC' | 'DESC'
}

export function getCompanies(params: CompanyListParams, signal?: AbortSignal) {
  return apiGet<ListResponse<Company>>('/company/', { ...params }, signal)
}

export function getCompany(id: number, signal?: AbortSignal) {
  return apiGet<DetailResponse<CompanyDetail>>(`/company/${id}/`, undefined, signal)
}
