import { CreditCard as CardType } from "@/hooks/use-cards"
import { cn } from "@/lib/utils"

interface CreditCardVisualProps {
    card: CardType
    className?: string
}

export const CreditCardVisual = ({ card, className }: CreditCardVisualProps) => {
    return (
        <div 
            className={cn("relative  w-full aspect-[1.586] rounded-xl p-6 text-white shadow-lg overflow-hidden", className)}
            style={{ background: `linear-gradient(135deg, ${card.color} 0%, ${card.color}dd 100%)` }}
        >
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
            
            <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start">
                    <div className="text-lg font-bold tracking-wider">{card.name}</div>
                    <div className="text-xl font-bold italic opacity-80">{card.brand}</div>
                </div>

                <div className="flex flex-col gap-1">
                     <div className="flex gap-2">
                        <div className="w-10 h-8 bg-yellow-400/80 rounded flex items-center justify-center">
                            <div className="w-6 h-5 border border-yellow-600/50 rounded-sm grid grid-cols-2">
                                <span className="border-r border-yellow-600/50"></span>
                                <span></span>
                            </div>
                        </div>
                     </div>
                     <div className="text-xl font-mono tracking-widest mt-2">
                        •••• •••• •••• {card.last4Digits}
                     </div>
                </div>

                <div className="flex justify-between items-end">
                    <div>
                        <div className="text-[10px] uppercase opacity-75">Limite Disponível</div>
                        <div className="font-semibold">R$ {(card.limit - card.currentInvoice).toLocaleString()}</div>
                    </div>
                    <div>
                         <div className="text-[10px] uppercase opacity-75">Fatura Atual</div>
                         <div className="font-semibold text-lg">R$ {card.currentInvoice.toLocaleString()}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
