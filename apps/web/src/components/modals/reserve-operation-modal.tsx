"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { MoneyInput } from "@/components/ui/money-input"
import { useReserves, Reserve } from "@/hooks/use-reserves"

const operationSchema = z.object({
  amount: z.number().min(0.01),
})

type OperationFormValues = z.infer<typeof operationSchema>

interface ReserveOperationModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    reserve: Reserve | null
    type: 'DEPOSIT' | 'WITHDRAW'
}

export function ReserveOperationModal({ open, onOpenChange, reserve, type }: ReserveOperationModalProps) {
  const { deposit, withdraw } = useReserves()

  const form = useForm<OperationFormValues>({
    resolver: zodResolver(operationSchema),
    defaultValues: {
      amount: 0,
    },
  })

  const onSubmit = async (values: OperationFormValues) => {
    if (!reserve) return

    if (type === 'DEPOSIT') {
      await deposit.mutateAsync({
        id: reserve.id,
        amount: values.amount
      })
    } else {
      await withdraw.mutateAsync({
        id: reserve.id,
        amount: values.amount
      })
    }
    
    onOpenChange(false)
    form.reset()
  }

  const isPending = type === 'DEPOSIT' ? deposit.isPending : withdraw.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
              {type === 'DEPOSIT' ? 'Investir em ' : 'Resgatar de '}
              {reserve?.name}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                     <MoneyInput 
                         value={field.value} 
                         onValueChange={field.onChange} 
                         placeholder="R$ 0,00"
                         autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
                type="submit" 
                className={`w-full ${type === 'WITHDRAW' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                disabled={isPending}
            >
                 {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                 {type === 'DEPOSIT' ? 'Confirmar Investimento' : 'Confirmar Resgate'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
