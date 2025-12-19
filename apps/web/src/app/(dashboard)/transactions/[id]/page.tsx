"use client"

import { PageHeader } from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTransactions } from "@/hooks/use-transactions"
import { format } from "date-fns"
import { TransactionModal } from "@/components/modals/transaction-modal"

export default function TransactionDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  // In a real app we'd fetch specific ID: useTransaction(params.id)
  // For now iterating the list or mocking
  const { data: transactions, remove } = useTransactions()
  const transaction = transactions.find(t => t.id === params.id)

  if (!transaction) {
      return (
          <div className="p-6">
              <h1 className="text-xl">Transação não encontrada</h1>
              <Button variant="link" onClick={() => router.back()}>Voltar</Button>
          </div>
      )
  }

  const handleDelete = async () => {
      if(confirm("Tem certeza que deseja excluir esta transação?")) {
        await remove.mutateAsync(transaction.id)
        router.push('/transactions')
      }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
          </Button>
          <PageHeader 
            title="Detalhes da Transação" 
            description={`ID: ${transaction.id}`}
          />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
          <Card>
              <CardHeader>
                  <CardTitle>Informações Gerais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div className="flex justifying-between border-b pb-2">
                      <span className="font-medium">Descrição</span>
                      <span className="text-muted-foreground ml-auto">{transaction.description}</span>
                  </div>
                  <div className="flex justifying-between border-b pb-2">
                      <span className="font-medium">Valor</span>
                      <span className={`file:ml-auto font-bold ${transaction.type === 'EXPENSE' ? 'text-red-500' : 'text-green-500'} ml-auto`}>
                          {transaction.type === 'EXPENSE' ? '-' : '+'} R$ {transaction.amount.toFixed(2)}
                      </span>
                  </div>
                  <div className="flex justifying-between border-b pb-2">
                      <span className="font-medium">Data</span>
                      <span className="text-muted-foreground ml-auto">{format(new Date(transaction.date), "dd/MM/yyyy")}</span>
                  </div>
                  <div className="flex justifying-between border-b pb-2">
                      <span className="font-medium">Categoria</span>
                      <span className="text-muted-foreground ml-auto">{transaction.category.name}</span>
                  </div>
                  <div className="flex justifying-between border-b pb-2">
                      <span className="font-medium">Conta</span>
                      <span className="text-muted-foreground ml-auto">{transaction.account.name}</span>
                  </div>
                  <div className="flex justifying-between pb-2">
                      <span className="font-medium">Status</span>
                      <span className="text-muted-foreground ml-auto">
                          {transaction.status === 'PAID' ? 'Pago/Recebido' : 'Pendente'}
                      </span>
                  </div>
              </CardContent>
          </Card>
          
          <Card>
               <CardHeader>
                    <CardTitle>Ações</CardTitle>
               </CardHeader>
               <CardContent className="flex flex-col gap-4">
                    <TransactionModal 
                        data={transaction} 
                        trigger={<Button className="w-full">Editar Transação</Button>}
                    />
                    <Button variant="destructive" className="w-full" onClick={handleDelete}>
                        <Trash className="mr-2 h-4 w-4" />
                        Excluir Transação
                    </Button>
               </CardContent>
          </Card>
      </div>
    </div>
  )
}
