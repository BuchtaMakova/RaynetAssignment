import { useQuery } from '@tanstack/react-query'
import { getImage } from '../api/images'

export function useImage(id: number | null) {
  return useQuery({
    queryKey: ['image', id],
    queryFn: ({ signal }) => getImage(id!, signal),
    enabled: id !== null,
    staleTime: Infinity,
    // Raynet posílá rovnou data URL, ale kdyby přišlo jen base64, poskládám si ji
    select: (image) =>
      image.imgData.startsWith('data:') ? image.imgData : `data:${image.contentType};base64,${image.imgData}`,
  })
}
