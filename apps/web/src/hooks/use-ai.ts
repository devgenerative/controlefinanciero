import { useQuery, useMutation } from '@tanstack/react-query'
import api from '@/lib/api'

export interface Insight {
    type: string
    severity: 'WARNING' | 'INFO' | 'SUCCESS' | 'DANGER'
    title: string
    description: string
    suggestion?: string
    data?: any
}

export interface SimulationResult {
    scenario: string
    impact: any
    suggestions: string[]
}

export const useAI = () => {
  const classify = useMutation({
      mutationFn: async (data: { description: string, amount: number }) => {
          const res = await api.post('/ai/classify', data)
          return res.data
      }
  })

  const insights = useQuery<Insight[]>({
      queryKey: ['ai', 'insights'],
      queryFn: async () => {
          const { data } = await api.get('/ai/insights')
          return data.insights
      }
  })

  const simulate = useMutation({
      mutationFn: async (data: { type: string, params: any }) => {
          const res = await api.post('/ai/simulate', data)
          return res.data
      }
  })

  const chat = useMutation({
      mutationFn: async (data: { message: string, context?: any }) => {
          const res = await api.post('/ai/chat', data)
          return res.data
      }
  })
  
  return { classify, insights, simulate, chat }
}
