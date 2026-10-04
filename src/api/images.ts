import { apiGet } from './client'

// Pozor, tenhle endpoint jako jediný nevrací obálku { success, data }
export interface ImageFile {
  fileName: string
  contentType: string
  // chodí rovnou jako data URL (data:image/png;base64,...)
  imgData: string
}

export function getImage(id: number, signal?: AbortSignal) {
  return apiGet<ImageFile>(`/image/${id}/`, undefined, signal)
}
