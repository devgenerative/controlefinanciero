"use client"

import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { forgotPasswordSchema, ForgotPasswordValues } from "@/lib/validations/auth"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  const { forgotPassword, isLoading } = useAuth()
  
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = (data: ForgotPasswordValues) => {
    forgotPassword(data)
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Recuperar senha</h1>
        <p className="text-muted-foreground">
          Digite seu email para receber as instruções
        </p>
      </div>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            placeholder="seu@email.com" 
            type="email" 
            {...form.register("email")} 
          />
          {form.formState.errors.email && (
            <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
          )}
        </div>

        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Enviar email
        </Button>
      </form>

      <div className="text-center text-sm">
         <Link href="/login" className="inline-flex items-center text-muted-foreground hover:text-foreground">
           <ArrowLeft className="mr-2 h-4 w-4" />
           Voltar para login
         </Link>
      </div>
    </div>
  )
}
