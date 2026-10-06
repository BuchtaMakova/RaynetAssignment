// Volám jen vlastní /api, přihlašovací údaje k požadavkům přidává proxy ve vite.config.ts
const API_BASE = '/api'

// Raynet vrací seznamy vždycky v téhle obálce
export interface ListResponse<T> {
  success: boolean
  totalCount: number
  data: T[]
}

export interface DetailResponse<T> {
  success: boolean
  data: T
}

export type QueryParams = Record<string, string | number | boolean | undefined>

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function buildUrl(path: string, params?: QueryParams): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params ?? {})) {
    // prázdné hodnoty neposílám, jinak by v URL bylo třeba fulltext=
    if (value !== undefined && value !== '') search.set(key, String(value))
  }
  const query = search.toString()
  return `${API_BASE}${path}${query ? `?${query}` : ''}`
}

function errorMessage(status: number, body: unknown): string {
  if (status === 401) return 'Neplatné přihlašovací údaje k Raynet API (zkontroluj .env).'
  if (status === 429) return 'Byl překročen limit požadavků na Raynet API.'
  if (body && typeof body === 'object' && 'error' in body && typeof body.error === 'string') {
    return body.error
  }
  return `Požadavek selhal (HTTP ${status}).`
}

export async function apiGet<T>(path: string, params?: QueryParams, signal?: AbortSignal): Promise<T> {
  let res: Response
  try {
    res = await fetch(buildUrl(path, params), { signal })
  } catch (error) {
    // zrušený požadavek musí projít dál, TanStack Query ho pozná a ignoruje
    if (signal?.aborted) throw error
    throw new ApiError(0, 'Nepodařilo se spojit se serverem. Zkontrolujte připojení a že běží npm run dev.')
  }
  const body: unknown = await res.json().catch(() => null)

  if (!res.ok) throw new ApiError(res.status, errorMessage(res.status, body))
  // 200, ale ne JSON – typicky neběží proxy a místo API přijde index.html
  if (body === null) {
    throw new ApiError(res.status, 'Server nevrátil data z Raynetu. Aplikace musí běžet přes npm run dev nebo npm run preview.')
  }
  return body as T
}
