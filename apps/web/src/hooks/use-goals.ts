import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { toast } from 'sonner'

export interface GoalContribution {
    id: string
    amount: number
    date: string
}

export interface Goal {
    id: string
    name: string
    currentAmount: number
    targetAmount: number
    deadline?: string
    color: string
    icon: string
    status: 'IN_PROGRESS' | 'COMPLETED' | 'LATE'
    contributions?: GoalContribution[]
}

export const useGoals = () => {
  const queryClient = useQueryClient()

  const query = useQuery<Goal[]>({
    queryKey: ['goals'],
    queryFn: async () => {
      try {
          const { data } = await api.get('/goals')
          return data
      } catch (e) {
          console.warn("API Error, returning empty array")
          return []
      }
    },
  })

  const create = useMutation({
      mutationFn: async (data: any) => {
          return api.post('/goals', data)
      },
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['goals'] })
          toast.success("Meta criada com sucesso!")
      }
  })

  const contribute = useMutation({
      mutationFn: async (data: { id: string, amount: number }) => {
          return api.post(`/goals/${data.id}/contribute`, { amount: data.amount })
      },
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['goals'] })
          toast.success("Contribuição realizada!")
      }
  })

  return { 
      data: query.data || [], 
      isLoading: query.isLoading,
      create,
      contribute
  }
}
