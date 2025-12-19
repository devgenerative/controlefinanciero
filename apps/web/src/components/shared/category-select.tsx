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
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"

interface Category {
  id: string
  name: string
  color?: string
  icon?: string
  type: string
}

interface CategorySelectProps {
  value?: string
  onChange: (value: string) => void
  type?: "INCOME" | "EXPENSE" | "TRANSFER"
}

export function CategorySelect({ value, onChange, type }: CategorySelectProps) {
  const [open, setOpen] = React.useState(false)

  const { data: categories = [] } = useQuery<Category[]>({
      queryKey: ['categories', type],
      queryFn: async () => {
          // Providing mock data fallback for now or assuming API structure
          const response = await api.get('/categories', { params: { type } })
          return response.data
      },
      // Keep placeholder data to prevent break if API fails
      placeholderData: [
          { id: '1', name: 'Alimentação', type: 'EXPENSE', color: '#f59e0b' },
          { id: '2', name: 'Moradia', type: 'EXPENSE', color: '#ef4444' },
          { id: '3', name: 'Salário', type: 'INCOME', color: '#22c55e' },
      ].filter(c => !type || c.type === type)
  })

  // Filter if type is specified in props, though API should handle it
  const filteredCategories = type 
    ? categories.filter(c => c.type === type)
    : categories

  const selectedCategory = categories.find((category) => category.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedCategory ? (
            <div className="flex items-center gap-2">
                <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: selectedCategory.color || '#ccc' }} 
                />
                {selectedCategory.name}
            </div>
          ) : (
            "Selecione uma categoria..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Buscar categoria..." />
          <CommandEmpty>Nenhuma categoria encontrada.</CommandEmpty>
          <CommandGroup>
            {filteredCategories.map((category) => (
              <CommandItem
                key={category.id}
                value={category.name} // Command uses name for search mostly
                onSelect={() => {
                  onChange(category.id === value ? "" : category.id)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === category.id ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex items-center gap-2">
                    <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: category.color || '#ccc' }} 
                    />
                   {category.name}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
