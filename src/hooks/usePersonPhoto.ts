import { useQuery } from '@tanstack/react-query'
import { getPerson } from '../api/persons'
import { useImage } from './useImage'

// Většina klientů má stejného vlastníka, díky cache se osoba i fotka stáhnou jen jednou.
export function usePersonPhoto(personId: number) {
  const { data: photoId } = useQuery({
    queryKey: ['person', personId],
    queryFn: ({ signal }) => getPerson(personId, signal),
    staleTime: 5 * 60_000,
    select: (response) => response.data.photo?.id ?? null,
  })

  return useImage(photoId ?? null).data
}
