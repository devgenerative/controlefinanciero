import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { toast } from 'sonner'

export interface RecurringTransaction {
  id: string
  description: string
  amount: number
  type: 'INCOME' | 'EXPENSE'
  frequency: 'WEEKLY' | 'MONTHLY' | 'YEARLY' | 'CUSTOM'
  startDate: string
  endDate?: string
  dueDay?: number
  isActive: boolean
  lastProcessedAt?: string
  nextRunScheduledAt?: string
  accountId: string
  categoryId?: string
  account?: { id: string; name: string }
  category?: { id: string; name: string; color?: string }
}

export interface Projection {
  date: string
  description: string
  amount: number
  type: string
  source: 'REAL' | 'PROJECTED'
  status: string
  balance: number
  category?: string
}

export interface ProjectionResponse {
  initialBalance: number
  projections: Projection[]
  summary: {
    totalIncome: number
    totalExpenses: number
    finalBalance: number
  }
}

export const useRecurring = () => {
  const queryClient = useQueryClient()

  const query = useQuery<RecurringTransaction[]>({
    queryKey: ['recurring'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/recurring')
        return Array.isArray(data) ? data : []
      } catch (e) {
        console.warn("API Error fetching recurring transactions")
        return []
      }
    },
  })

  const create = useMutation({
    mutationFn: async (data: Partial<RecurringTransaction>) => {
      return api.post('/recurring', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring'] })
      toast.success("Conta recorrente criada!")
    },
    onError: () => {
      toast.error("Erro ao criar conta recorrente")
    }
  })

  const update = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<RecurringTransaction> }) => {
      return api.patch(`/recurring/${id}`, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring'] })
      toast.success("Conta recorrente atualizada!")
    },
    onError: () => {
      toast.error("Erro ao atualizar conta recorrente")
    }
  })

  const toggle = useMutation({
    mutationFn: async (id: string) => {
      return api.patch(`/recurring/${id}/toggle`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring'] })
      toast.success("Status atualizado!")
    },
  })

  const remove = useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`/recurring/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring'] })
      toast.success("Conta recorrente removida!")
    },
  })

  return {
    data: query.data || [],
    isLoading: query.isLoading,
    create,
    update,
    toggle,
    remove,
  }
}

export const useProjection = (startDate?: string, endDate?: string) => {
  return useQuery<ProjectionResponse>({
    queryKey: ['projection', startDate, endDate],
    queryFn: async () => {
      const { data } = await api.get('/recurring/projection', {
        params: { start: startDate, end: endDate }
      })
      return data
    },
    enabled: !!startDate && !!endDate,
  })
}
