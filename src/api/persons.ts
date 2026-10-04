import { apiGet, type DetailResponse } from './client'

// owner.id u klienta je ID osoby, potřebuju z ní hlavně fotku
export interface Person {
  id: number
  firstName: string | null
  lastName: string | null
  photo: { id: number } | null
}

export function getPerson(id: number, signal?: AbortSignal) {
  return apiGet<DetailResponse<Person>>(`/person/${id}/`, undefined, signal)
}
