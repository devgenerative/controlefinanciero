import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { toast } from 'sonner'

export interface Reserve {
  id: string
  name: string
  type: 'EMERGENCY' | 'INVESTMENT' | 'SAVINGS' | 'OTHER'
  balance: number
  goal?: number
  description?: string
}

export const useReserves = () => {
  const queryClient = useQueryClient()

  const query = useQuery<Reserve[]>({
    queryKey: ['reserves'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/reserves')
        return data
      } catch (e) {
        console.warn("API Error, returning empty array")
        return []
      }
    },
  })

  const create = useMutation({
    mutationFn: async (data: Partial<Reserve>) => {
      return api.post('/reserves', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reserves'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success("Reserva criada com sucesso!")
    },
    onError: () => {
      toast.error("Erro ao criar reserva")
    }
  })

  const deposit = useMutation({
    mutationFn: async ({ id, amount }: { id: string, amount: number }) => {
      return api.post(`/reserves/${id}/deposit`, { amount })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reserves'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success("Depósito realizado!")
    },
    onError: () => {
      toast.error("Erro ao depositar")
    }
  })

  const withdraw = useMutation({
    mutationFn: async ({ id, amount }: { id: string, amount: number }) => {
      return api.post(`/reserves/${id}/withdraw`, { amount })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reserves'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success("Saque realizado!")
    },
    onError: () => {
      toast.error("Erro ao sacar")
    }
  })

  const remove = useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`/reserves/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reserves'] })
      toast.success("Reserva removida")
    }
  })

  return {
    data: query.data || [],
    isLoading: query.isLoading,
    create,
    deposit,
    withdraw,
    remove
  }
}
