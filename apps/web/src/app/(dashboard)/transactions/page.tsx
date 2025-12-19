"use client"

import { useTransactions } from "@/hooks/use-transactions"
import { PageHeader } from "@/components/shared/PageHeader"
import { DataTable } from "@/components/shared/data-table"
import { TransactionModal } from "@/components/modals/transaction-modal"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"
import { Transaction } from "@/hooks/use-transactions"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "date",
    header: "Data",
    cell: ({ row }) => {
       const date = new Date(row.getValue("date"))
       return format(date, "dd/MM/yyyy")
    }
  },
  {
    accessorKey: "description",
    header: "Descrição",
  },
  {
    accessorKey: "category.name",
    header: "Categoria",
    cell: ({ row }) => {
        const cat: any = row.original.category
        return (
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat?.color }}></div>
                {cat?.name}
            </div>
        )
    }
  },
  {
    accessorKey: "account.name",
    header: "Conta",
  },
  {
    accessorKey: "amount",
    header: "Valor",
    cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"))
        const type = row.original.type
        const color = type === 'INCOME' ? 'text-green-600' : type === 'EXPENSE' ? 'text-red-600' : 'text-blue-600'
        
        return (
            <div className={`font-medium ${color}`}>
                 {type === 'EXPENSE' ? '-' : '+'} R$ {amount.toFixed(2)}
            </div>
        )
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
        const status: string = row.getValue("status")
        return (
            <Badge variant={status === 'PAID' ? 'default' : 'secondary'}>
                {status === 'PAID' ? 'Pago' : 'Pendente'}
            </Badge>
        )
    }
  },
]

export default function TransactionsPage() {
  const { data, isLoading } = useTransactions()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transações"
        description="Gerencie suas receitas e despesas"
        actions={
          <TransactionModal 
            trigger={
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Nova Transação
                </Button>
            } 
          />
        }
      />
      
      <div className="bg-white rounded-md border p-4">
           {isLoading ? (
               <div>Carregando...</div>
           ) : (
               <DataTable columns={columns} data={data} filterKey="description" />
           )}
      </div>
    </div>
  )
}
