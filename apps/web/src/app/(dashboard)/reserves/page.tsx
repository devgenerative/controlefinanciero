"use client"

import { useState } from "react"
import { PageHeader } from "@/components/shared/PageHeader"
import { useReserves, Reserve } from "@/hooks/use-reserves"
import { ReserveCard } from "@/components/reserves/ReserveCard"
import { ReserveOperationModal } from "@/components/modals/reserve-operation-modal"
import { PieChart } from "@/components/charts/PieChart" // Reusing PieChart
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from "lucide-react"

export default function ReservesPage() {
    const { data: reserves, isLoading } = useReserves()
    const [selectedReserve, setSelectedReserve] = useState<Reserve | null>(null)
    const [operationType, setOperationType] = useState<'DEPOSIT' | 'WITHDRAW'>('DEPOSIT')
    const [modalOpen, setModalOpen] = useState(false)

    const handleOperate = (type: 'DEPOSIT' | 'WITHDRAW', reserve: Reserve) => {
        setSelectedReserve(reserve)
        setOperationType(type)
        setModalOpen(true)
    }

    const chartData = reserves.map(r => ({
        name: r.name,
        value: r.balance,
        color: r.color
    }))

    const totalReserves = reserves.reduce((acc, curr) => acc + curr.balance, 0)

    return (
        <div className="space-y-6">
            <PageHeader
                title="Minhas Reservas"
                description={`Patrimônio acumulado: R$ ${totalReserves.toLocaleString()}`}
            />

            <div className="grid gap-6 md:grid-cols-3">
                 {/* Allocation Chart */}
                 <div className="md:col-span-1 min-h-[300px] border rounded-xl p-4 bg-card">
                     <h3 className="font-semibold mb-4">Alocação de Ativos</h3>
                     <PieChart data={chartData} />
                 </div>

                 {/* Reserves Grid */}
                 <div className="md:col-span-2 space-y-4">
                     {reserves.some(r => r.type === 'EMERGENCY' && r.balance < 10000) && (
                         <Alert>
                             <Info className="h-4 w-4" />
                             <AlertTitle>Dica Financeira</AlertTitle>
                             <AlertDescription>
                                 Sua Reserva de Emergência está abaixo do ideal. Considere focar seus aportes aqui.
                             </AlertDescription>
                         </Alert>
                     )}

                     <div className="grid gap-4 sm:grid-cols-2">
                        {isLoading && <div>Carregando reservas...</div>}
                        {reserves.map(reserve => (
                            <ReserveCard 
                                key={reserve.id} 
                                reserve={reserve} 
                                onOperate={handleOperate} 
                            />
                        ))}
                     </div>
                 </div>
            </div>

            <ReserveOperationModal 
                open={modalOpen} 
                onOpenChange={setModalOpen} 
                reserve={selectedReserve} 
                type={operationType}
            />
        </div>
    )
}
