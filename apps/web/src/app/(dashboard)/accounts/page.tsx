"use client"

import { useState } from "react"
import { PageHeader } from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import { Plus, Wallet, CreditCard, PiggyBank, TrendingUp, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAccounts } from "@/hooks/use-accounts"
import { AccountModal } from "@/components/modals/account-modal"

const typeLabels = {
  CHECKING: { label: "Conta Corrente", icon: CreditCard },
  SAVINGS: { label: "Poupança", icon: PiggyBank },
  INVESTMENT: { label: "Investimento", icon: TrendingUp },
  WALLET: { label: "Carteira", icon: Wallet }
}

export default function AccountsPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const { data: accounts, isLoading, remove } = useAccounts()

  const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Contas"
          description="Gerencie suas contas bancárias e carteiras"
        />
        <div>Carregando...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contas"
        description="Gerencie suas contas bancárias e carteiras"
        actions={
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Nova Conta
          </Button>
        }
      />

      {/* Summary Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Saldo Total</CardDescription>
          <CardTitle className="text-3xl">
            R$ {totalBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {accounts.length} conta{accounts.length !== 1 ? 's' : ''} ativa{accounts.length !== 1 ? 's' : ''}
          </p>
        </CardContent>
      </Card>

      {/* Accounts List */}
      {accounts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <Wallet className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">Nenhuma conta cadastrada</p>
            <Button onClick={() => setModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Adicionar Primeira Conta
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {accounts.map((account) => {
            const typeInfo = typeLabels[account.type as keyof typeof typeLabels] || typeLabels.CHECKING
            const IconComponent = typeInfo.icon

            return (
              <Card key={account.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: account.color ? `${account.color}20` : '#8b5cf620' }}
                      >
                        <IconComponent 
                          className="h-5 w-5" 
                          style={{ color: account.color || '#8b5cf6' }}
                        />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{account.name}</CardTitle>
                        <CardDescription>
                          <Badge variant="outline">{typeInfo.label}</Badge>
                        </CardDescription>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => remove.mutate(account.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-2xl font-bold" style={{ color: account.color || '#8b5cf6' }}>
                    R$ {Number(account.balance).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <AccountModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  )
}
