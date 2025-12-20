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
import { useAccounts } from "@/hooks/use-accounts"

const accountSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  type: z.enum(["CHECKING", "SAVINGS", "INVESTMENT", "WALLET"]),
  balance: z.number().min(0, "Saldo não pode ser negativo"),
  color: z.string().optional(),
})

type AccountFormValues = z.infer<typeof accountSchema>

interface AccountModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const typeLabels = {
  CHECKING: "Conta Corrente",
  SAVINGS: "Poupança",
  INVESTMENT: "Investimento",
  WALLET: "Carteira"
}

const colors = [
  { value: "#8b5cf6", label: "Roxo" },
  { value: "#ec4899", label: "Rosa" },
  { value: "#f59e0b", label: "Laranja" },
  { value: "#22c55e", label: "Verde" },
  { value: "#3b82f6", label: "Azul" },
  { value: "#ef4444", label: "Vermelho" },
]

export function AccountModal({ open, onOpenChange }: AccountModalProps) {
  const { create } = useAccounts()

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      type: "CHECKING",
      balance: 0,
      color: "#8b5cf6",
    },
  })

  const onSubmit = async (values: AccountFormValues) => {
    await create.mutateAsync(values)
    onOpenChange(false)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nova Conta</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Conta</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Nubank, Itaú, Carteira" {...field} />
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
                      {Object.entries(typeLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="balance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Saldo Inicial</FormLabel>
                  <FormControl>
                    <MoneyInput 
                      value={field.value} 
                      onChange={field.onChange} 
                      placeholder="R$ 0,00"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor</FormLabel>
                  <div className="flex gap-2">
                    {colors.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          field.value === color.value ? 'border-foreground scale-110' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color.value }}
                        onClick={() => field.onChange(color.value)}
                        title={color.label}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                Criar Conta
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
