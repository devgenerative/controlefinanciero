import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { DateRange } from 'react-day-picker'
import { format } from 'date-fns'

interface DashboardFilters {
  start: string // YYYY-MM-DD
  end: string // YYYY-MM-DD
}

export const useDashboard = (dateRange: DateRange | undefined) => {
  const filters: DashboardFilters | undefined = dateRange?.from ? {
    start: format(dateRange.from, 'yyyy-MM-dd'),
    end: dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : format(dateRange.from, 'yyyy-MM-dd')
  } : undefined

  const summary = useQuery({
    queryKey: ['dashboard', 'summary', filters],
    queryFn: async () => {
      // Assuming params are passed as query string
      const { data } = await api.get('/dashboard/summary', { params: filters })
      return data
    },
    enabled: !!filters,
  })

  // Evolution is typically meant for a longer period (e.g., 12 months) regardless of the filter,
  // or it adapts. Let's assume it fetches 12 months context.
  const evolution = useQuery({
    queryKey: ['dashboard', 'evolution'],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/evolution')
      return data
    },
  })

  const byCategory = useQuery({
    queryKey: ['dashboard', 'by-category', filters],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/by-category', { params: filters })
      return data
    },
    enabled: !!filters,
  })
  
  const upcomingBills = useQuery({
    queryKey: ['dashboard', 'upcoming'],
    queryFn: async () => {
       const { data } = await api.get('/dashboard/upcoming')
       return data
    }
  })
  
  const goals = useQuery({
      queryKey: ['goals'],
      queryFn: async () => {
          const { data } = await api.get('/goals')
          return data
      }
  })

  // Mocking comparison for now, assuming endpoint exists or handled by summary
  const comparison = useQuery({
      queryKey: ['dashboard', 'comparison', filters],
      queryFn: async () => {
          // Placeholder if endpoint isn't exactly mapping to "comparison"
          // Re-using summary or fetching history logic
          return [] 
      },
      enabled: false // Disabled until endpoint verified
  })

  return {
    summary,
    evolution,
    byCategory,
    upcomingBills,
    goals,
    comparison,
    isLoading: summary.isLoading || evolution.isLoading || byCategory.isLoading
  }
}
