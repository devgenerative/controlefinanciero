"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAI, SimulationResult } from "@/hooks/use-ai"
import { Loader2, TrendingUp, Sparkles } from "lucide-react"

export function SimulatorModal() {
  const [result, setResult] = useState<SimulationResult | null>(null)
  const [params, setParams] = useState({ amount: "" })
  const { simulate } = useAI()
  
  const handleSimulate = async (type: string) => {
      const res = await simulate.mutateAsync({ 
          type: type, 
          params: { amount: Number(params.amount) } 
      })
      setResult(res)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
            <Sparkles className="h-4 w-4 text-amber-500" />
            Simulador IA
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Simulador de Cenários Financeiros</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="SAVE_MONTHLY" className="w-full mt-4">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="SAVE_MONTHLY">Poupar Mensalmente</TabsTrigger>
                <TabsTrigger value="CUT_CATEGORY">Corte de Gastos</TabsTrigger>
            </TabsList>

            <TabsContent value="SAVE_MONTHLY" className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label>Quanto você quer poupar por mês?</Label>
                    <Input 
                        placeholder="Ex: 500" 
                        type="number" 
                        value={params.amount}
                        onChange={(e) => setParams({...params, amount: e.target.value })}
                    />
                </div>
                <Button 
                    className="w-full" 
                    onClick={() => handleSimulate('SAVE_MONTHLY')}
                    disabled={simulate.isPending || !params.amount}
                >
                    {simulate.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Simular Impacto
                </Button>
            </TabsContent>
             
             {/* Add other tab contents as needed */}
             <TabsContent value="CUT_CATEGORY" className="py-4 text-center text-muted-foreground">
                 Em breve...
             </TabsContent>
        </Tabs>

        {result && (
            <div className="mt-6 p-4 bg-muted/50 rounded-lg space-y-4 animate-in fade-in">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    {result.scenario}
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                     <div className="p-3 bg-background rounded border">
                         <div className="text-sm text-muted-foreground">Saldo Projetado (1 ano)</div>
                         <div className="text-xl font-bold text-primary">
                             R$ {result.impact?.yearly?.withInterest?.toLocaleString()}
                         </div>
                     </div>
                     <div className="p-3 bg-background rounded border">
                         <div className="text-sm text-muted-foreground">Taxa de Poupança</div>
                         <div className="text-xl font-bold text-green-600">
                             {((result.impact?.monthly?.savingsRate || 0)*100).toFixed(0)}%
                         </div>
                     </div>
                </div>

                <div className="space-y-2">
                    <div className="text-sm font-medium">Sugestões da IA:</div>
                    <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                        {result.suggestions?.map((s, i) => (
                            <li key={i}>{s}</li>
                        ))}
                    </ul>
                </div>
            </div>
        )}

      </DialogContent>
    </Dialog>
  )
}
