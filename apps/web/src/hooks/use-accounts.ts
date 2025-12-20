import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { toast } from 'sonner'

export interface Account {
    id: string
    name: string
    type: 'CHECKING' | 'SAVINGS' | 'INVESTMENT' | 'WALLET'
    balance: number
    color?: string
    isActive: boolean
}

export const useAccounts = () => {
  const queryClient = useQueryClient()

  const query = useQuery<Account[]>({
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

  const create = useMutation({
    mutationFn: async (data: Partial<Account>) => {
      return api.post('/accounts', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast.success("Conta criada com sucesso!")
    },
    onError: () => {
      toast.error("Erro ao criar conta")
    }
  })

  const update = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Account> }) => {
      return api.patch(`/accounts/${id}`, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast.success("Conta atualizada!")
    },
    onError: () => {
      toast.error("Erro ao atualizar conta")
    }
  })

  const remove = useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`/accounts/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast.success("Conta removida!")
    },
  })

  return {
    data: query.data || [],
    isLoading: query.isLoading,
    create,
    update,
    remove,
  }
}
