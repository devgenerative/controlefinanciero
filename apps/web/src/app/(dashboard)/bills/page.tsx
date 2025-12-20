"use client"

import { useState } from "react"
import { PageHeader } from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import { Plus, Pause, Play, Trash2, RefreshCw, TrendingUp, TrendingDown, CalendarDays } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRecurring } from "@/hooks/use-recurring"
import { RecurringModal } from "@/components/modals/recurring-modal"

const frequencyLabels = {
  WEEKLY: "Semanal",
  MONTHLY: "Mensal",
  YEARLY: "Anual",
  CUSTOM: "Personalizado"
}

const typeLabels = {
  INCOME: { label: "Receita", color: "text-green-600", bg: "bg-green-100" },
  EXPENSE: { label: "Despesa", color: "text-red-600", bg: "bg-red-100" }
}

export default function BillsPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const { data: recurring, isLoading, toggle, remove } = useRecurring()

  const activeItems = recurring.filter(r => r.isActive)
  const inactiveItems = recurring.filter(r => !r.isActive)

  const totalMonthlyExpenses = activeItems
    .filter(r => r.type === 'EXPENSE' && r.frequency === 'MONTHLY')
    .reduce((sum, r) => sum + Number(r.amount), 0)

  const totalMonthlyIncome = activeItems
    .filter(r => r.type === 'INCOME' && r.frequency === 'MONTHLY')
    .reduce((sum, r) => sum + Number(r.amount), 0)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Contas Recorrentes"
          description="Gerencie suas contas fixas e receitas recorrentes"
        />
        <div>Carregando...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contas Recorrentes"
        description="Gerencie suas contas fixas e receitas recorrentes"
        actions={
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Nova Conta
          </Button>
        }
      />

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas Mensais</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              R$ {totalMonthlyExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              {activeItems.filter(r => r.type === 'EXPENSE').length} contas ativas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receitas Mensais</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {totalMonthlyIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              {activeItems.filter(r => r.type === 'INCOME').length} receitas ativas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Recorrente</CardTitle>
            <RefreshCw className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalMonthlyIncome - totalMonthlyExpenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              R$ {(totalMonthlyIncome - totalMonthlyExpenses).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Balanço mensal previsto
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active Recurring Items */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Contas Ativas</h2>
        {activeItems.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <CalendarDays className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhuma conta recorrente cadastrada</p>
              <Button className="mt-4" onClick={() => setModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Adicionar Primeira Conta
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeItems.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{item.description}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Badge variant="outline">{frequencyLabels[item.frequency]}</Badge>
                        <Badge className={typeLabels[item.type].bg + " " + typeLabels[item.type].color + " border-0"}>
                          {typeLabels[item.type].label}
                        </Badge>
                      </CardDescription>
                    </div>
                    <div className={`text-xl font-bold ${item.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                      {item.type === 'INCOME' ? '+' : '-'} R$ {Number(item.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span>Vencimento: Dia {item.dueDay || 1}</span>
                    {item.category && (
                      <span className="flex items-center gap-1">
                        <div 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: item.category.color || '#ccc' }} 
                        />
                        {item.category.name}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => toggle.mutate(item.id)}
                    >
                      <Pause className="mr-1 h-3 w-3" /> Pausar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => remove.mutate(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Inactive Items */}
      {inactiveItems.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-muted-foreground">Contas Pausadas</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {inactiveItems.map((item) => (
              <Card key={item.id} className="opacity-60 hover:opacity-100 transition-opacity">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{item.description}</CardTitle>
                      <CardDescription>
                        <Badge variant="secondary">Pausada</Badge>
                      </CardDescription>
                    </div>
                    <div className="text-xl font-bold text-muted-foreground">
                      R$ {Number(item.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => toggle.mutate(item.id)}
                  >
                    <Play className="mr-1 h-3 w-3" /> Reativar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <RecurringModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  )
}
