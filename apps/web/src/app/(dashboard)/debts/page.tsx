"use client"

import { useState } from "react"
import { PageHeader } from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useDebts } from "@/hooks/use-debts"
import { DebtModal } from "@/components/modals/debt-modal"

const typeLabels = {
  FINANCING: "Financiamento",
  LOAN: "Empréstimo",
  CREDIT_CARD: "Cartão de Crédito",
  OTHER: "Outro"
}

export default function DebtsPage() {
  const [debtModalOpen, setDebtModalOpen] = useState(false)
  const { data: debts, isLoading } = useDebts()
  
  const totalDebt = debts.reduce((sum, debt) => sum + (debt.remainingAmount ?? (Number(debt.totalAmount) * (debt.totalInstallments - (debt.paidInstallments || 0)) / (debt.totalInstallments || 1))), 0)
  const monthlyCommitment = debts.reduce((sum, debt) => sum + (debt.monthlyPayment ?? (Number(debt.totalAmount) / (debt.totalInstallments || 1))), 0)
  const averageInterest = debts.length > 0 
    ? debts.reduce((sum, debt) => sum + Number(debt.interestRate || 0), 0) / debts.length 
    : 0

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Dívidas"
          description="Gerencie seus financiamentos e empréstimos"
        />
        <div>Carregando...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dívidas"
        description="Gerencie seus financiamentos e empréstimos"
        actions={
          <Button onClick={() => setDebtModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Nova Dívida
          </Button>
        }
      />

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total de Dívidas</CardDescription>
            <CardTitle className="text-2xl text-red-600">
              R$ {totalDebt.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Comprometimento Mensal</CardDescription>
            <CardTitle className="text-2xl">
              R$ {monthlyCommitment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Taxa Média</CardDescription>
            <CardTitle className="text-2xl">
              {averageInterest.toFixed(2)}% a.m.
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total de Dívidas</CardDescription>
            <CardTitle className="text-2xl">
              {debts.length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Debts List */}
      <div className="grid gap-4">
        {debts.map((debt) => {
          const progress = (debt.paidInstallments / debt.totalInstallments) * 100
          
          return (
            <Card key={debt.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{debt.name}</CardTitle>
                    <CardDescription className="mt-1">
                      <Badge variant="outline">{typeLabels[debt.type as keyof typeof typeLabels]}</Badge>
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-600">
                      R$ {(debt.remainingAmount ?? (Number(debt.totalAmount) * (debt.totalInstallments - (debt.paidInstallments || 0)) / (debt.totalInstallments || 1))).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      de R$ {Number(debt.totalAmount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progresso</span>
                    <span className="font-medium">
                      {debt.paidInstallments}/{debt.totalInstallments} parcelas
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Parcela Mensal</div>
                    <div className="font-semibold">
                      R$ {(debt.monthlyPayment ?? (Number(debt.totalAmount) / (debt.totalInstallments || 1))).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Taxa de Juros</div>
                    <div className="font-semibold">{debt.interestRate}% a.m.</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Próximo Vencimento</div>
                    <div className="font-semibold">
                      {debt.nextDueDate ? new Date(debt.nextDueDate).toLocaleDateString('pt-BR') : `Dia ${debt.dueDay} do próximo mês`}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Ver Detalhes
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Simular Antecipação
                  </Button>
                  <Button variant="outline" size="sm">
                    Registrar Pagamento
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}

      <DebtModal 
        open={debtModalOpen} 
        onOpenChange={setDebtModalOpen}
      />
      </div>
    </div>
  )
}
