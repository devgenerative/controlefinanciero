"use client"

import { PageHeader } from "@/components/shared/PageHeader"
import { useCards } from "@/hooks/use-cards"
import { CreditCardVisual } from "@/components/cards/CreditCardVisual"
import { CardModal } from "@/components/modals/card-modal"
import Link from "next/link"

export default function CardsPage() {
    const { data: cards, isLoading } = useCards()

    return (
        <div className="space-y-6">
            <PageHeader
                title="Cartões de Crédito"
                description="Gerencie seus cartões e faturas"
                actions={<CardModal />}
            />

            {isLoading && <div>Carregando cartões...</div>}
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {cards.map(card => (
                    <Link href={`/cards/${card.id}`} key={card.id}>
                        <div className="hover:scale-[1.02] transition-transform cursor-pointer">
                            <CreditCardVisual card={card} />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
