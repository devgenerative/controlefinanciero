"use client"

import { useState } from "react"
import { DateRange } from "react-day-picker"
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  PiggyBank, 
  CreditCard
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

import { PageHeader } from "@/components/shared/PageHeader"
import { StatsCard } from "@/components/shared/StatsCard"
import { DateRangePicker } from "@/components/shared/date-range-picker"
import { LineChart } from "@/components/charts/LineChart"
import { BarChart } from "@/components/charts/BarChart"
import { PieChart } from "@/components/charts/PieChart"

import { useDashboard } from "@/hooks/use-dashboard"
import { useTransactions } from "@/hooks/use-transactions"
import { useGoals } from "@/hooks/use-goals"
import { useCards } from "@/hooks/use-cards"

export default function DashboardPage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  })

  const { summary, evolution, byCategory, upcomingBills, isLoading } = useDashboard(date)
  const { data: transactions } = useTransactions()
  const { data: goals } = useGoals()
  const { data: cards } = useCards()

  // Use real data or fallback to empty arrays
  const evolutionData = evolution.data || []
  const pieData = byCategory.data || []

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="Dashboard" 
          description="Visão geral das suas finanças"
        />
        <div>Carregando...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Dashboard" 
        description="Visão geral das suas finanças"
        actions={
           <div className="flex items-center gap-2">
               <DateRangePicker date={date} onDateChange={setDate} />
           </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
           title="Saldo Total" 
           value={summary.data?.totalBalance ? `R$ ${summary.data.totalBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : "R$ 0,00"} 
           icon={Wallet}
        />
        <StatsCard 
           title="Receitas" 
           value={summary.data?.totalIncome ? `R$ ${summary.data.totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : "R$ 0,00"} 
           icon={TrendingUp} 
           variant="success"
        />
        <StatsCard 
           title="Despesas" 
           value={summary.data?.totalExpenses ? `R$ ${summary.data.totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : "R$ 0,00"} 
           icon={TrendingDown} 
           variant="danger"
        />
        <StatsCard 
           title="Poupado" 
           value={summary.data?.saved ? `R$ ${summary.data.saved.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : "R$ 0,00"} 
           icon={PiggyBank} 
           description={summary.data?.savingsRate ? `${summary.data.savingsRate}% da renda` : "0% da renda"}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-7 lg:grid-cols-7">
        <Card className="col-span-4 md:col-span-5">
           <CardHeader>
             <CardTitle>Evolução Patrimonial</CardTitle>
           </CardHeader>
           <CardContent className="pl-2">
             {evolutionData.length > 0 ? (
               <LineChart 
                  data={evolutionData} 
                  xAxisKey="month" 
                  lines={[
                      { key: "saldo", color: "#2563eb", name: "Saldo" },
                      { key: "receitas", color: "#16a34a", name: "Receitas" }
                  ]}
               />
             ) : (
               <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                 Nenhum dado disponível
               </div>
             )}
           </CardContent>
        </Card>
        <Card className="col-span-3 md:col-span-2">
           <CardHeader>
             <CardTitle>Por Categoria</CardTitle>
           </CardHeader>
           <CardContent>
             {pieData.length > 0 ? (
               <PieChart 
                  data={pieData} 
                  dataKey="value" 
                  nameKey="name" 
               />
             ) : (
               <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                 Nenhum dado disponível
               </div>
             )}
           </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
         {/* Main Content (Transactions etc) */}
         <div className="col-span-5 space-y-4">
            <Card className="col-span-7">
              <CardHeader>
                  <CardTitle>Comparativo Mensal</CardTitle>
              </CardHeader>
              <CardContent>
                  {evolutionData.length > 0 ? (
                    <BarChart 
                        data={evolutionData} 
                        xAxisKey="month" 
                        bars={[
                            { key: 'receitas', color: '#16a34a', name: 'Receitas' },
                            { key: 'despesas', color: '#dc2626', name: 'Despesas' }
                        ]}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                      Nenhum dado disponível
                    </div>
                  )}
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
               <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Últimas Transações</CardTitle>
                      <Button variant="ghost" size="sm" className="text-xs">Ver todas</Button>
                  </CardHeader>
                  <CardContent>
                      <div className="space-y-4">
                          {transactions.slice(0, 5).length > 0 ? transactions.slice(0, 5).map((transaction) => (<div key={transaction.id} className="flex items-center justify-between"><div className="flex items-center gap-3"><div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center"><Wallet className="h-4 w-4" /></div><div><p className="text-sm font-medium">{transaction.description}</p><p className="text-xs text-muted-foreground">{transaction.category?.name || 'Sem categoria'}</p></div></div><div className={`text-sm font-medium ${transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>{transaction.type === 'INCOME' ? '+' : '-'} R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div></div>)) : (<div className="text-center py-4 text-muted-foreground text-sm">Nenhuma transação recente</div>)}
                      </div>
                  </CardContent>
               </Card>
               <Card>
                  <CardHeader>
                      <CardTitle>Próximas Contas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                         {upcomingBills.data && upcomingBills.data.length > 0 ? (
                           upcomingBills.data.slice(0, 3).map((bill: any) => (
                             <div key={bill.id} className="flex items-center justify-between border-l-4 border-l-red-500 pl-3">
                                 <div>
                                     <p className="text-sm font-medium">{bill.description}</p>
                                     <p className="text-xs text-red-500">Vence {new Date(bill.dueDate).toLocaleDateString('pt-BR')}</p>
                                 </div>
                                 <div className="text-sm font-bold">R$ {bill.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                             </div>
                           ))
                         ) : (
                           <div className="text-center py-4 text-muted-foreground text-sm">
                             Nenhuma conta próxima
                           </div>
                         )}
                    </div>
                  </CardContent>
               </Card>
            </div>
         </div>

         {/* Right Sidebar */}
         <div className="col-span-2 space-y-4">
             <Card>
                 <CardHeader>
                     <CardTitle>Minhas Metas</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-6">
                      {goals.length > 0 ? (
                        goals.slice(0, 3).map((goal) => {
                          const progress = goal.targetAmount > 0 ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100) : 0
                          return (
                            <div key={goal.id} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium">{goal.name}</span>
                                    <span className="text-muted-foreground">{progress.toFixed(0)}%</span>
                                </div>
                                <Progress value={progress} />
                            </div>
                          )
                        })
                      ) : (
                        <div className="text-center py-4 text-muted-foreground text-sm">
                          Nenhuma meta cadastrada
                        </div>
                      )}
                      <Button variant="outline" className="w-full text-xs" size="sm">Ver detalhes</Button>
                 </CardContent>
             </Card>

             <Card>
                 <CardHeader>
                     <CardTitle>Cartões</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4">
                      {cards.length > 0 ? (
                        cards.slice(0, 2).map((card) => {
                          const usage = card.limit > 0 ? Math.min((card.currentInvoice / card.limit) * 100, 100) : 0
                          return (
                            <div key={card.id} className="rounded-lg border p-3">
                                <div className="flex items-center justify-between mb-2">
                                     <span className="text-sm font-medium flex items-center gap-2">
                                         <CreditCard className="h-4 w-4" /> {card.name}
                                     </span>
                                     <span className="text-xs text-muted-foreground">Vence {card.dueDay}/{new Date().getMonth() + 1}</span>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-muted-foreground">Fatura atual</span>
                                        <span className="font-bold">R$ {card.currentInvoice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <Progress value={usage} className="h-1.5" />
                                    <p className="text-[10px] text-muted-foreground text-right mt-1">Limite: R$ {card.limit.toLocaleString('pt-BR')}</p>
                                </div>
                            </div>
                          )
                        })
                      ) : (
                        <div className="text-center py-4 text-muted-foreground text-sm">
                          Nenhum cartão cadastrado
                        </div>
                      )}
                     <Button className="w-full" variant="secondary" size="sm">Gerenciar Cartões</Button>
                 </CardContent>
             </Card>
          </div>
      </div>
    </div>
  )
}
