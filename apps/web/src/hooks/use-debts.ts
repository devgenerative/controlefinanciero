import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { toast } from 'sonner'

export interface Debt {
  id: string
  name: string
  type: 'FINANCING' | 'LOAN' | 'CREDIT_CARD' | 'OTHER'
  totalAmount: number
  remainingAmount: number
  monthlyPayment: number
  paidInstallments: number
  totalInstallments: number
  interestRate: number
  dueDay: number
  nextDueDate: Date
}

export const useDebts = () => {
  const queryClient = useQueryClient()

  const query = useQuery<Debt[]>({
    queryKey: ['debts'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/debts')
        return data
      } catch (e) {
        console.warn("API Error, returning empty array")
        return []
      }
    },
  })

  const create = useMutation({
    mutationFn: async (data: Partial<Debt>) => {
      return api.post('/debts', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] })
      toast.success("Dívida criada com sucesso!")
    },
    onError: () => {
      toast.error("Erro ao criar dívida")
    }
  })

  return {
    data: query.data || [],
    isLoading: query.isLoading,
    create
  }
}
