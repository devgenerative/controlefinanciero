import { useState } from "react"
import api from "@/lib/api"
import { useAuthStore } from "@/stores/auth-store"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { LoginValues, RegisterValues, ForgotPasswordValues, ResetPasswordValues } from "@/lib/validations/auth"

export const useAuth = () => {
  const { user, login: setAuth, logout: performLogout } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const login = async (data: LoginValues) => {
    try {
      setIsLoading(true)
      const response = await api.post("/auth/login", {
        email: data.email,
        password: data.password,
      })
      
      const { user, accessToken, refreshToken } = response.data
      setAuth(user, accessToken, refreshToken)
      toast.success("Login realizado com sucesso!")
      router.push("/")
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao realizar login")
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: RegisterValues) => {
    try {
      setIsLoading(true)
      await api.post("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
      })
      
      // Auto login after register or redirect to login? 
      // Requirement says "Auto-login após registro"
      await login({ email: data.email, password: data.password, remember: false })
      
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao realizar cadastro")
      setIsLoading(false)
    }
  }

  const logout = () => {
    performLogout()
    router.push("/login")
    toast.info("Você saiu da conta")
  }

  const forgotPassword = async (data: ForgotPasswordValues) => {
    try {
      setIsLoading(true)
      await api.post("/auth/forgot-password", data)
      toast.success("Email enviado com instruções para recuperação de senha")
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao solicitar recuperação")
    } finally {
      setIsLoading(false)
    }
  }

  const resetPassword = async (token: string, data: ResetPasswordValues) => {
    try {
      setIsLoading(true)
      await api.post("/auth/reset-password", {
        token,
        password: data.password,
      })
      toast.success("Senha alterada com sucesso!")
      router.push("/login")
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao redefinir senha")
    } finally {
      setIsLoading(false)
    }
  }

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
  }
}
