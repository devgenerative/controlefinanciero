"use client"

import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, LoginValues } from "@/lib/validations/auth"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const { login, isLoading } = useAuth()
  
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  })

  const onSubmit = (data: LoginValues) => {
    login(data)
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Bem-vindo de volta</h1>
        <p className="text-muted-foreground">
          Entre com suas credenciais para acessar sua conta
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

        <div className="space-y-2">
          <div className="flex items-center justify-between">
             <Label htmlFor="password">Senha</Label>
             <Link 
                href="/forgot-password"
                className="text-sm text-primary hover:underline"
             >
                Esqueceu a senha?
             </Link>
          </div>
          <Input 
             id="password" 
             type="password" 
             {...form.register("password")} 
          />
          {form.formState.errors.password && (
            <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center space-x-2">
           <Checkbox 
              id="remember" 
              checked={form.watch("remember")}
              onCheckedChange={(c) => form.setValue("remember", c as boolean)}
           />
           <Label htmlFor="remember" className="font-normal cursor-pointer">
              Lembrar-me neste dispositivo
           </Label>
        </div>

        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Entrar
        </Button>
      </form>

      <div className="text-center text-sm">
         Não tem uma conta?{" "}
         <Link href="/register" className="text-primary hover:underline font-semibold">
           Criar conta
         </Link>
      </div>
    </div>
  )
}
