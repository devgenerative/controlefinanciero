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
        return data
      } catch(e) {
          // Mock data
          return [
              { id: '1', name: 'Nubank', type: 'CHECKING', balance: 1500 },
              { id: '2', name: 'Itaú', type: 'CHECKING', balance: 3500 },
              { id: '3', name: 'Carteira', type: 'CASH', balance: 250 },
          ]
      }
    },
  })
}
