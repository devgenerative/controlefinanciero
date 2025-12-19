"use client"

import { use } from "react"
import { PageHeader } from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCardVisual } from "@/components/cards/CreditCardVisual"
import { InvoiceTimeline } from "@/components/cards/InvoiceTimeline"
import { useCards } from "@/hooks/use-cards"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus } from "lucide-react"

export default function CardDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()
    const { data: cards } = useCards()
    const card = cards.find(c => c.id === id)

    // Mock invoices
    const invoices = [
        { id: '1', month: 'OUT', amount: 2350.90, status: 'PAID' },
        { id: '2', month: 'NOV', amount: 3100.50, status: 'PAID' },
        { id: '3', month: 'DEZ', amount: 1250.00, status: 'OPEN' },
        { id: '4', month: 'JAN', amount: 450.00, status: 'FUTURE' },
    ] as any[]

    if (!card) return <div className="p-6">Cartão não encontrado</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                 <Button variant="ghost" size="icon" onClick={() => router.back()}>
                     <ArrowLeft className="h-4 w-4" />
                 </Button>
                 <PageHeader title={card.name} description={`Final ${card.last4Digits} • Limite: R$ ${card.limit.toLocaleString()}`} />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-6">
                    <CreditCardVisual card={card} />
                    
                    <Card>
                        <CardHeader>
                            <CardTitle>Resumo da Fatura</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span>Fatura Atual</span>
                                <span className="font-bold text-red-500">R$ {card.currentInvoice.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Limite Disponível</span>
                                <span>R$ {(card.limit - card.currentInvoice).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Vencimento</span>
                                <span>Dia {card.dueDay}</span>
                            </div>
                             <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Fechamento</span>
                                <span>Dia {card.closingDay}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                     <Card>
                        <CardHeader>
                            <CardTitle>Histórico de Faturas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <InvoiceTimeline invoices={invoices} />
                        </CardContent>
                     </Card>

                     <Card>
                         <CardHeader className="flex flex-row items-center justify-between">
                             <CardTitle>Últimas Compras</CardTitle>
                             <Button variant="outline" size="sm">
                                <Plus className="w-4 h-4 mr-2" />
                                Nova Despesa
                             </Button>
                         </CardHeader>
                         <CardContent>
                             <div className="space-y-4">
                                 {/* Mock transactions list */}
                                 <div className="flex justify-between border-b pb-2">
                                     <div>
                                         <div className="font-medium">Uber</div>
                                         <div className="text-xs text-muted-foreground">Ontem</div>
                                     </div>
                                     <div className="font-bold">R$ 29,90</div>
                                 </div>
                                  <div className="flex justify-between border-b pb-2">
                                     <div>
                                         <div className="font-medium">Netflix</div>
                                         <div className="text-xs text-muted-foreground">15/12</div>
                                     </div>
                                     <div className="font-bold">R$ 55,90</div>
                                 </div>
                             </div>
                         </CardContent>
                     </Card>
                </div>
            </div>
        </div>
    )
}
