"use client"

import { PageHeader } from "@/components/shared/PageHeader"
import { useGoals } from "@/hooks/use-goals"
import { GoalCard } from "@/components/goals/GoalCard"
import { GoalModal } from "@/components/modals/goal-modal"

export default function GoalsPage() {
    const { data: goals, isLoading } = useGoals()

    return (
        <div className="space-y-6">
            <PageHeader
                title="Metas Financeiras"
                description="Acompanhe seus objetivos de longo prazo"
                actions={<GoalModal />}
            />

            {isLoading && <div>Carregando metas...</div>}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {goals.map(goal => (
                    <GoalCard key={goal.id} goal={goal} />
                ))}
            </div>
        </div>
    )
}
