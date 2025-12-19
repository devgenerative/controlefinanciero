"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { resetPasswordSchema, ResetPasswordValues } from "@/lib/validations/auth"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, ArrowLeft } from "lucide-react"

export default function ResetPasswordPage() {
  const { resetPassword, isLoading } = useAuth()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  
  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  if (!token) {
      return (
          <div className="w-full max-w-sm text-center space-y-4">
              <h1 className="text-xl font-bold text-destructive">Link inválido</h1>
              <p className="text-muted-foreground">O link de recuperação parece estar inválido ou expirado.</p>
              <Button asChild variant="outline">
                  <Link href="/forgot-password">Solicitar novo link</Link>
              </Button>
          </div>
      )
  }

  const onSubmit = (data: ResetPasswordValues) => {
    resetPassword(token, data)
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Nova senha</h1>
        <p className="text-muted-foreground">
          Crie uma nova senha segura
        </p>
      </div>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
           <Label htmlFor="password">Nova Senha</Label>
           <Input 
             id="password" 
             type="password" 
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

        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Alterar senha
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
