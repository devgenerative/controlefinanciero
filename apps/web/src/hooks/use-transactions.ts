import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { toast } from 'sonner'

export interface Transaction {
    id: string
    description: string
    amount: number
    date: string
    type: 'INCOME' | 'EXPENSE' | 'TRANSFER'
    status: 'PENDING' | 'PAID' | 'CANCELLED' | 'SCHEDULED'
    category: {
        id: string
        name: string
        color: string
        icon: string
    }
    account?: {
        id: string
        name: string
    }
    paymentMethod?: string
    installment?: {
        current: number
        total: number
    }
    tags?: string[]
}

export type CreateTransactionDTO = Omit<Transaction, 'id' | 'status' | 'category' | 'account'> & {
    categoryId: string
    accountId: string
    status?: string
}

interface TransactionsFilters {
    start?: string
    end?: string
    type?: string
}

export const useTransactions = (filters?: TransactionsFilters) => {
  const queryClient = useQueryClient()

  const query = useQuery<Transaction[]>({
    queryKey: ['transactions', filters],
    queryFn: async () => {
      // Mock data if endpoint fails or returns 404
      try {
          const { data } = await api.get('/transactions', { params: filters })
          return data
      } catch (e) {
          console.warn("API Error, using mock data")
          return [] 
      }
    },
  })

  const create = useMutation({
      mutationFn: async (data: any) => {
          return api.post('/transactions', data)
      },
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['transactions'] })
          queryClient.invalidateQueries({ queryKey: ['dashboard'] })
          toast.success("Transação criada com sucesso!")
      },
      onError: (error: any) => {
          toast.error("Erro ao criar transação")
      }
  })
  
  const remove = useMutation({
      mutationFn: async (id: string) => {
          return api.delete(`/transactions/${id}`)
      },
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['transactions'] })
          toast.success("Transação removida")
      }
  })
  
  return { 
      data: query.data || [], 
      isLoading: query.isLoading,
      create,
      remove
  }
}
