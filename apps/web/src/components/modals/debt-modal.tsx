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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { MoneyInput } from "@/components/shared/money-input"
import { useDebts } from "@/hooks/use-debts"

const debtSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  type: z.enum(["FINANCING", "LOAN", "CREDIT_CARD", "OTHER"]),
  totalAmount: z.number().min(0.01, "Valor total deve ser maior que zero"),
  remainingAmount: z.number().min(0, "Saldo devedor inválido"),
  monthlyPayment: z.number().min(0.01, "Parcela mensal deve ser maior que zero"),
  interestRate: z.number().min(0, "Taxa de juros inválida"),
  dueDay: z.number().min(1).max(31, "Dia de vencimento inválido"),
})

type DebtFormValues = z.infer<typeof debtSchema>

interface DebtModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DebtModal({ open, onOpenChange }: DebtModalProps) {
  const { create } = useDebts()

  const form = useForm<DebtFormValues>({
    resolver: zodResolver(debtSchema),
    defaultValues: {
      name: "",
      type: "LOAN",
      totalAmount: 0,
      remainingAmount: 0,
      monthlyPayment: 0,
      interestRate: 0,
      dueDay: 1,
    },
  })

  const onSubmit = async (values: DebtFormValues) => {
    await create.mutateAsync(values)
    onOpenChange(false)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nova Dívida</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Financiamento do Carro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="FINANCING">Financiamento</SelectItem>
                      <SelectItem value="LOAN">Empréstimo</SelectItem>
                      <SelectItem value="CREDIT_CARD">Cartão de Crédito</SelectItem>
                      <SelectItem value="OTHER">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="totalAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Total</FormLabel>
                    <FormControl>
                      <MoneyInput 
                        value={field.value} 
                        onValueChange={field.onChange} 
                        placeholder="R$ 0,00"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="remainingAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Saldo Devedor</FormLabel>
                    <FormControl>
                      <MoneyInput 
                        value={field.value} 
                        onValueChange={field.onChange} 
                        placeholder="R$ 0,00"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="monthlyPayment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parcela Mensal</FormLabel>
                    <FormControl>
                      <MoneyInput 
                        value={field.value} 
                        onValueChange={field.onChange} 
                        placeholder="R$ 0,00"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="interestRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Taxa (%)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dia Venc.</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        min="1"
                        max="31"
                        placeholder="1"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={create.isPending}
              >
                {create.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Criar Dívida
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
