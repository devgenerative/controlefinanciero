"use client"

import { use } from "react"
import { PageHeader } from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useGoals } from "@/hooks/use-goals"
import { useRouter } from "next/navigation"
import { ArrowLeft, TrendingUp } from "lucide-react"

export default function GoalDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()
    const { data: goals } = useGoals()
    const goal = goals.find(g => g.id === id)

    if (!goal) return <div className="p-6">Meta não encontrada</div>

    const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                 <Button variant="ghost" size="icon" onClick={() => router.back()}>
                     <ArrowLeft className="h-4 w-4" />
                 </Button>
                 <PageHeader title={goal.name} description="Detalhes e Evolução" />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Progresso</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                             <div>
                                 <div className="text-3xl font-bold">R$ {goal.currentAmount.toLocaleString()}</div>
                                 <div className="text-sm text-muted-foreground">de R$ {goal.targetAmount.toLocaleString()}</div>
                             </div>
                             <div className="text-right">
                                 <div className="text-3xl font-bold text-primary">{progress.toFixed(0)}%</div>
                                 <div className="text-sm text-muted-foreground">Concluído</div>
                             </div>
                        </div>

                        <Progress value={progress} className="h-4" />

                        <div className="p-4 bg-muted/50 rounded-lg flex gap-4 items-center">
                            <TrendingUp className="h-8 w-8 text-green-500" />
                            <div>
                                <div className="font-semibold">Bom ritmo!</div>
                                <div className="text-sm text-muted-foreground">
                                    Continue guardando R$ 500/mês para atingir a meta em {goal.deadline ? new Date(goal.deadline).toLocaleDateString() : "8 meses"}.
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Ações</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button className="w-full">Adicionar Valor</Button>
                            <Button variant="outline" className="w-full">Editar Meta</Button>
                            <Button variant="ghost" className="w-full text-red-500 hover:text-red-600">Excluir</Button>
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader>
                            <CardTitle>Histórico</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <div className="space-y-4">
                                 {/* Mock history */}
                                 <div className="flex justify-between border-b pb-2">
                                     <div className="text-sm">Depósito Inicial</div>
                                     <div className="font-bold text-green-600">+ R$ 10.000</div>
                                 </div>
                                 <div className="flex justify-between border-b pb-2">
                                     <div className="text-sm">Aporte Mensal</div>
                                     <div className="font-bold text-green-600">+ R$ 5.000</div>
                                 </div>
                             </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
