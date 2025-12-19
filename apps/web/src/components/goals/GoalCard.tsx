"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProgressRing } from "@/components/goals/ProgressRing"
import { Goal } from "@/hooks/use-goals"
import { Target, Plane, Car, Home, Wallet } from "lucide-react"
import Link from "next/link"

const ICON_MAP: any = {
    'Target': Target,
    'Plane': Plane,
    'Car': Car,
    'Home': Home,
    'Wallet': Wallet
}

interface GoalCardProps {
    goal: Goal
}

export const GoalCard = ({ goal }: GoalCardProps) => {
  const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
  const Icon = ICON_MAP[goal.icon] || Target

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
                <div 
                    className="p-2 rounded-lg text-white" 
                    style={{ backgroundColor: goal.color }}
                >
                    <Icon className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="font-semibold">{goal.name}</h3>
                    <p className="text-xs text-muted-foreground">
                        {goal.deadline ? `Vence em ${new Date(goal.deadline).toLocaleDateString()}` : "Sem prazo"}
                    </p>
                </div>
            </div>
            <ProgressRing 
                radius={28} 
                stroke={4} 
                progress={progress} 
                color={goal.color}
            />
        </div>
        
        <div className="space-y-1 mb-4">
            <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Atual</span>
                <span className="font-bold">R$ {goal.currentAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
                <span>Meta</span>
                <span>R$ {goal.targetAmount.toLocaleString()}</span>
            </div>
        </div>

        <div className="flex gap-2">
            <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href={`/goals/${goal.id}`}>Detalhes</Link>
            </Button>
            <Button size="sm" className="w-full">Contribuir</Button>
        </div>
      </CardContent>
    </Card>
  )
}
