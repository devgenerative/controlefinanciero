"use client"

import { useState } from "react"
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
import { MoneyInput } from "@/components/ui/money-input"
import { useCards } from "@/hooks/use-cards"

const cardSchema = z.object({
  name: z.string().min(3),
  last4Digits: z.string().length(4),
  limit: z.number().min(0),
  closingDay: z.string(), // Input type number returns string often, need refine
  dueDay: z.string(),
  color: z.string().min(1),
  brand: z.enum(['VISA', 'MASTERCARD', 'ELO', 'AMEX', 'OTHER'])
})

type CardFormValues = z.infer<typeof cardSchema>

export function CardModal({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const { create } = useCards()

  const form = useForm<CardFormValues>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      name: "",
      last4Digits: "",
      limit: 0,
      closingDay: "1",
      dueDay: "10",
      color: "#000000",
      brand: 'VISA'
    },
  })

  const onSubmit = async (values: CardFormValues) => {
    // Convert string numbers to real numbers if needed
    await create.mutateAsync({
        ...values,
        closingDay: Number(values.closingDay),
        dueDay: Number(values.dueDay)
    })
    setOpen(false)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Novo Cartão</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Cartão de Crédito</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Cartão</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Nubank Principal" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
                 <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bandeira</FormLabel>
                      <FormControl>
                        <select className="w-full p-2 border rounded-md" {...field}>
                            <option value="VISA">Visa</option>
                            <option value="MASTERCARD">Mastercard</option>
                            <option value="ELO">Elo</option>
                            <option value="AMEX">Amex</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="last4Digits"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Últimos 4 dígitos</FormLabel>
                      <FormControl>
                        <Input placeholder="1234" maxLength={4} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>

            <FormField
              control={form.control}
              name="limit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Limite Total</FormLabel>
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

            <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="closingDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dia Fechamento</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" max="31" {...field} />
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
                      <FormLabel>Dia Vencimento</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" max="31" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
             <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor do Cartão</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                         <Input type="color" className="w-12 p-1 h-10" {...field} />
                         <Input {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={create.isPending}>
                 {create.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                 Salvar Cartão
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
