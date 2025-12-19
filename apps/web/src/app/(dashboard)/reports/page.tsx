"use client"

import { useState } from "react"
import { DateRange } from "react-day-picker"
import { PageHeader } from "@/components/shared/PageHeader"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DateRangePicker } from "@/components/shared/date-range-picker"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useDashboard } from "@/hooks/use-dashboard"
import { useTransactions } from "@/hooks/use-transactions"

export default function ReportsPage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  })

  const { summary, evolution, byCategory, isLoading } = useDashboard(date)
  const { data: transactions } = useTransactions()

  // Use real data or fallback to empty
  const monthlyData = evolution.data || []
  const categoryData = byCategory.data || []
  
  // Get top 10 expenses
  const topExpenses = transactions
    .filter(t => t.type === 'EXPENSE')
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10)

  const totalIncome = summary.data?.totalIncome || 0
  const totalExpense = summary.data?.totalExpenses || 0
  const balance = totalIncome - totalExpense
  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : '0.0'

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Relatórios"
          description="Análise detalhada das suas finanças"
        />
        <div>Carregando...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Relatórios"
        description="Análise detalhada das suas finanças"
        actions={
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Exportar PDF
          </Button>
        }
      />

      {/* Period Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Período</CardTitle>
          <CardDescription>Selecione o período para análise</CardDescription>
        </CardHeader>
        <CardContent>
          <DateRangePicker date={date} onDateChange={setDate} />
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Receitas</CardDescription>
            <CardTitle className="text-2xl text-green-600">
              R$ {totalIncome.toLocaleString('pt-BR')}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Despesas</CardDescription>
            <CardTitle className="text-2xl text-red-600">
              R$ {totalExpense.toLocaleString('pt-BR')}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Saldo</CardDescription>
            <CardTitle className={`text-2xl ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              R$ {balance.toLocaleString('pt-BR')}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Taxa de Poupança</CardDescription>
            <CardTitle className="text-2xl text-blue-600">
              {savingsRate}%
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Evolução Mensal</CardTitle>
            <CardDescription>Comparativo de receitas vs despesas</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="receitas" fill="#10B981" name="Receitas" />
                <Bar dataKey="despesas" fill="#EF4444" name="Despesas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Despesas por Categoria</CardTitle>
            <CardDescription>Distribuição dos gastos</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Expenses */}
      <Card>
        <CardHeader>
          <CardTitle>Maiores Gastos</CardTitle>
          <CardDescription>Top 10 despesas do período</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topExpenses.length > 0 ? (
              topExpenses.map((expense, index) => (
                <div key={expense.id || index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex-1">
                    <div className="font-medium">{expense.description}</div>
                    <div className="text-sm text-muted-foreground">
                      {expense.category?.name || 'Sem categoria'} • {new Date(expense.date).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                  <div className="text-lg font-semibold text-red-600">
                    R$ {expense.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma despesa encontrada
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
