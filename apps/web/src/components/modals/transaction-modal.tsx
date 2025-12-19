"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, Loader2, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { useAI } from "@/hooks/use-ai"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { MoneyInput } from "@/components/ui/money-input"
import { CategorySelect } from "@/components/shared/category-select"
import { AccountSelect } from "@/components/shared/account-select"
import { useTransactions, Transaction } from "@/hooks/use-transactions"

const transactionSchema = z.object({
  amount: z.number().min(0.01, "Valor é obrigatório"),
  description: z.string().min(3, "Descrição muito curta"),
  date: z.date(),
  categoryId: z.string().min(1, "Categoria obrigatória"),
  accountId: z.string().min(1, "Conta obrigatória"),
  paid: z.boolean().default(true),
  type: z.enum(["INCOME", "EXPENSE", "TRANSFER"]),
  // For transfer
  toAccountId: z.string().optional(),
})

type TransactionFormValues = z.infer<typeof transactionSchema>

interface TransactionModalProps {
  trigger?: React.ReactNode
  data?: Transaction
  onClose?: () => void
}

export function TransactionModal({ trigger, data }: TransactionModalProps) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"EXPENSE" | "INCOME" | "TRANSFER">("EXPENSE")
  const { create } = useTransactions()
  const { classify } = useAI()
  const [isClassifying, setIsClassifying] = useState(false)

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: data?.amount || 0,
      description: data?.description || "",
      date: data ? new Date(data.date) : new Date(),
      categoryId: data?.category?.id || "",
      accountId: data?.account?.id || "",
      paid: data?.status === "PAID" ?? true,
      type: "EXPENSE",
    },
  })

  // AI Classification Logic
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
        if (name === 'description' && value.description && value.description.length > 3 && activeTab === 'EXPENSE') {
            const timeoutId = setTimeout(async () => {
                setIsClassifying(true)
                try {
                    const result = await classify.mutateAsync({ 
                        description: value.description!, 
                        amount: Number(value.amount || 0) 
                    })
                    
                    if (result && result.confidence > 0.7 && result.categoryId) {
                         const currentCategory = form.getValues('categoryId')
                         if (!currentCategory) {
                             form.setValue('categoryId', result.categoryId)
                             toast.success(`Categoria sugerida: ${result.categoryName}`)
                         }
                    }
                } catch (e) {
                    console.error("Auto-classification failed", e)
                } finally {
                    setIsClassifying(false)
                }
            }, 1000) // 1s debounce
            return () => clearTimeout(timeoutId)
        }
    })
    return () => subscription.unsubscribe()
  }, [form.watch, classify, activeTab, form])

  // Sync tab with form type
  const onTabChange = (value: string) => {
    setActiveTab(value as any)
    form.setValue("type", value as any)
    form.reset({
        ...form.getValues(),
        type: value as any,
        categoryId: "", // Reset category as it might differ by type
    })
  }

  const onSubmit = async (values: TransactionFormValues) => {
    await create.mutateAsync(values)
    setOpen(false)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Nova Transação</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
             {data ? "Editar Transação" : "Nova Transação"}
          </DialogTitle>
        </DialogHeader>

        {!data && (
            <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="EXPENSE">Despesa</TabsTrigger>
                <TabsTrigger value="INCOME">Receita</TabsTrigger>
                <TabsTrigger value="TRANSFER">Transf.</TabsTrigger>
            </TabsList>
            </Tabs>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            
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
                         autoFocus={!data}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Supermercado" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                    <FormLabel>Data</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                            )}
                            >
                            {field.value ? (
                                format(field.value, "dd/MM/yyyy")
                            ) : (
                                <span>Selecione</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                    </FormItem>
                )}
                />
                
                {activeTab !== "TRANSFER" && (
                    <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Categoria</FormLabel>
                        <FormControl>
                            <CategorySelect 
                                value={field.value} 
                                onChange={field.onChange} 
                                type={activeTab === "TRANSFER" ? undefined : activeTab}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                )}
            </div>

            <FormField
                control={form.control}
                name="accountId"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{activeTab === "TRANSFER" ? "Conta Origem" : "Conta"}</FormLabel>
                    <FormControl>
                        <AccountSelect value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />

            {activeTab === "TRANSFER" && (
                 <FormField
                 control={form.control}
                 name="toAccountId"
                 render={({ field }) => (
                     <FormItem>
                     <FormLabel>Conta Destino</FormLabel>
                     <FormControl>
                         <AccountSelect value={field.value} onChange={field.onChange} />
                     </FormControl>
                     <FormMessage />
                     </FormItem>
                 )}
             />
            )}

            {activeTab !== "TRANSFER" && (
                <FormField
                control={form.control}
                name="paid"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                        <FormLabel>Pago / Recebido</FormLabel>
                    </div>
                    <FormControl>
                        <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        />
                    </FormControl>
                    </FormItem>
                )}
                />
            )}

            <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                    Cancelar
                </Button>
                <Button type="submit" disabled={create.isPending}>
                    {create.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Salvar
                </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
