"use client"

import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema, RegisterValues } from "@/lib/validations/auth"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react"

export default function RegisterPage() {
  const { register: registerUser, isLoading } = useAuth()
  
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  })

  const onSubmit = (data: RegisterValues) => {
    registerUser(data)
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Crie sua conta</h1>
        <p className="text-muted-foreground">
          Comece a controlar suas finanças hoje mesmo
        </p>
      </div>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome completo</Label>
          <Input 
            id="name" 
            placeholder="Seu nome" 
            {...form.register("name")} 
          />
          {form.formState.errors.name && (
            <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
          )}
        </div>

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

        <div className="space-y-2">
           <Label htmlFor="password">Senha</Label>
           <Input 
             id="password" 
             type="password" 
             placeholder="Mínimo 8 caracteres"
             {...form.register("password")} 
           />
           {form.formState.errors.password && (
            <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
           )}
        </div>

        <div className="space-y-2">
           <Label htmlFor="confirmPassword">Confirmar senha</Label>
           <Input 
             id="confirmPassword" 
             type="password" 
             {...form.register("confirmPassword")} 
           />
           {form.formState.errors.confirmPassword && (
            <p className="text-sm text-destructive">{form.formState.errors.confirmPassword.message}</p>
           )}
        </div>

        <div className="flex items-start space-x-2">
           <Checkbox 
              id="terms" 
              checked={form.watch("terms")}
              onCheckedChange={(c) => form.setValue("terms", c as boolean)}
              className="mt-1"
           />
           <Label htmlFor="terms" className="font-normal cursor-pointer leading-tight">
              Eu concordo com os <Link href="/terms" className="text-primary hover:underline">termos de serviço</Link> e <Link href="/privacy" className="text-primary hover:underline">política de privacidade</Link>.
           </Label>
        </div>
        {form.formState.errors.terms && (
            <p className="text-sm text-destructive">{form.formState.errors.terms.message}</p>
        )}

        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Criar conta
        </Button>
      </form>

      <div className="text-center text-sm">
         Já tem uma conta?{" "}
         <Link href="/login" className="text-primary hover:underline font-semibold">
           Fazer login
         </Link>
      </div>
    </div>
  )
}
