"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Reserve } from "@/hooks/use-reserves"
import { Shield, TrendingUp } from "lucide-react"

interface ReserveCardProps {
    reserve: Reserve
    onOperate: (type: 'DEPOSIT' | 'WITHDRAW', reserve: Reserve) => void
}

export const ReserveCard = ({ reserve, onOperate }: ReserveCardProps) => {
  const getReserveDetails = (type: string) => {
    switch (type) {
      case 'EMERGENCY': return { color: '#f59e0b', yield: 10.5 }
      case 'INVESTMENT': return { color: '#22c55e', yield: 12.2 }
      case 'SAVINGS': return { color: '#3b82f6', yield: 6.17 }
      default: return { color: '#94a3b8', yield: 8.5 }
    }
  }

  const details = getReserveDetails(reserve.type)

  return (
    <Card className="hover:shadow-md transition-shadow relative overflow-hidden">
      <div 
        className="absolute top-0 left-0 w-1 h-full" 
        style={{ backgroundColor: details.color }}
      />
      <CardHeader className="pb-2">
         <div className="flex items-center justify-between">
             <CardTitle className="text-base font-medium flex items-center gap-2">
                 <Shield className="h-4 w-4 text-muted-foreground" />
                 {reserve.name}
             </CardTitle>
             <span className="text-xs font-bold px-2 py-1 rounded bg-muted text-muted-foreground">
                 {details.yield}% a.a.
             </span>
         </div>
      </CardHeader>
      <CardContent>
          <div className="mb-4">
              <span className="text-2xl font-bold">R$ {reserve.balance.toLocaleString()}</span>
              {reserve.type === 'EMERGENCY' && (
                  <p className="text-xs text-green-600 mt-1 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Ideal: R$ 30.000
                  </p>
              )}
          </div>
          
          <div className="grid grid-cols-2 gap-2">
              <Button size="sm" variant="outline" onClick={() => onOperate('DEPOSIT', reserve)}>
                  Depositar
              </Button>
              <Button size="sm" variant="ghost" onClick={() => onOperate('WITHDRAW', reserve)}>
                  Resgatar
              </Button>
          </div>
      </CardContent>
    </Card>
  )
}
