"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useAccounts } from "@/hooks/use-accounts"

interface AccountSelectProps {
  value?: string
  onChange: (value: string) => void
}

export function AccountSelect({ value, onChange }: AccountSelectProps) {
  const [open, setOpen] = React.useState(false)
  const { data: accounts = [] } = useAccounts()

  const selectedAccount = accounts.find((account) => account.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedAccount ? selectedAccount.name : "Selecione uma conta..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Buscar conta..." />
          <CommandList>
            <CommandEmpty>Nenhuma conta encontrada.</CommandEmpty>
            <CommandGroup>
                {accounts.map((account) => (
                <CommandItem
                    key={account.id}
                    value={account.name}
                    onSelect={() => {
                    onChange(account.id === value ? "" : account.id)
                    setOpen(false)
                    }}
                >
                    <Check
                    className={cn(
                        "mr-2 h-4 w-4",
                        value === account.id ? "opacity-100" : "opacity-0"
                    )}
                    />
                    {account.name} <span className="ml-auto text-xs text-muted-foreground">{account.type}</span>
                </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
