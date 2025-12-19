import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { toast } from 'sonner'

export interface CreditCard {
    id: string
    name: string
    last4Digits: string
    limit: number
    currentInvoice: number
    closingDay: number
    dueDay: number
    color: string
    brand: 'VISA' | 'MASTERCARD' | 'ELO' | 'AMEX' | 'OTHER'
}

export const useCards = () => {
    const queryClient = useQueryClient()

    const query = useQuery<CreditCard[]>({
        queryKey: ['cards'],
        queryFn: async () => {
            try {
                const { data } = await api.get('/cards')
                return data
            } catch (e) {
                console.warn("API Error, returning empty array")
                return []
            }
        }
    })

    const create = useMutation({
        mutationFn: async (data: any) => {
            return api.post('/cards', data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cards'] })
            toast.success("Cartão adicionado com sucesso!")
        }
    })

    return {
        data: query.data || [],
        isLoading: query.isLoading,
        create
    }
}
