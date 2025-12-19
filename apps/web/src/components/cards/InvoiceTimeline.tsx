"use client"

import { cn } from "@/lib/utils"
import { CheckCircle2, Circle, Clock } from "lucide-react"

interface Invoice {
    id: string
    month: string
    amount: number
    status: 'PAID' | 'OPEN' | 'FUTURE' | 'LATE'
}

interface InvoiceTimelineProps {
    invoices: Invoice[]
}

export const InvoiceTimeline = ({ invoices }: InvoiceTimelineProps) => {
    return (
        <div className="flex gap-4 overflow-x-auto pb-4">
            {invoices.map((invoice, index) => {
                const isPaid = invoice.status === 'PAID'
                const isOpen = invoice.status === 'OPEN'
                const isLate = invoice.status === 'LATE'
                
                return (
                    <div key={invoice.id} className="flex flex-col items-center min-w-[100px] relative group cursor-pointer">
                        {/* Connecting Line */}
                        {index < invoices.length - 1 && (
                            <div className={cn(
                                "absolute top-3 left-[50%] w-full h-[2px] -z-10",
                                isPaid ? "bg-primary" : "bg-muted"
                            )} />
                        )}

                        {/* Status Icon */}
                        <div className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center border-2 bg-background z-10 transition-colors",
                            isPaid && "border-primary text-primary",
                            isOpen && "border-blue-500 text-blue-500",
                            isLate && "border-red-500 text-red-500",
                            invoice.status === 'FUTURE' && "border-muted text-muted-foreground"
                        )}>
                            {isPaid && <CheckCircle2 className="w-4 h-4" />}
                            {isOpen && <Circle className="w-4 h-4 fill-current" />}
                            {isLate && <Circle className="w-4 h-4 fill-current" />}
                            {invoice.status === 'FUTURE' && <Clock className="w-4 h-4" />}
                        </div>

                        {/* Info */}
                        <div className="mt-2 text-center">
                            <div className="text-xs font-medium text-muted-foreground uppercase">{invoice.month}</div>
                            <div className={cn(
                                "text-sm font-bold",
                                isLate ? "text-red-500" : isOpen ? "text-blue-500" : ""
                            )}>
                                R$ {invoice.amount.toLocaleString()}
                            </div>
                            <div className="text-[10px] text-muted-foreground">
                                {invoice.status === 'OPEN' ? 'Aberta' : 
                                 invoice.status === 'PAID' ? 'Paga' :
                                 invoice.status === 'LATE' ? 'Atrasada' : 'Futura'}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
