import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

export interface Account {
    id: string
    name: string
    type: string
    balance: number
}

export const useAccounts = () => {
  return useQuery<Account[]>({
    queryKey: ['accounts'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/accounts')
        return Array.isArray(data) ? data : []
      } catch(e) {
          console.warn("API Error fetching accounts, returning empty array")
          return []
      }
    },
  })
}
