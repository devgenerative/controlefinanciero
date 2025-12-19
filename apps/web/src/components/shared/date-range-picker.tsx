"use client"

import * as React from "react"
import { addDays, format, subMonths } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DateRangePickerProps {
  className?: string
  date?: DateRange
  onDateChange?: (date: DateRange | undefined) => void
}

export function DateRangePicker({
  className,
  date,
  onDateChange,
}: DateRangePickerProps) {
  const [internalDate, setInternalDate] = React.useState<DateRange | undefined>(
    date || {
      from: new Date(),
      to: addDays(new Date(), 7),
    }
  )

  React.useEffect(() => {
    if (date) {
        setInternalDate(date)
    }
  }, [date])

  const handlePresetChange = (value: string) => {
    const today = new Date();
    let newDate: DateRange | undefined;
    
    switch (value) {
      case "today":
        newDate = { from: today, to: today };
        break;
      case "thisMonth":
        newDate = { from: new Date(today.getFullYear(), today.getMonth(), 1), to: today };
        break;
      case "lastMonth":
        const lastMonth = subMonths(today, 1);
        newDate = {
            from: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1), 
            to: new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0) 
        };
        break;
      case "last3Months":
        newDate = { from: subMonths(today, 3), to: today };
        break;
      case "year":
        newDate = { from: new Date(today.getFullYear(), 0, 1), to: today };
        break;
      default:
        break;
    }
    
    if (newDate) {
        setInternalDate(newDate);
        onDateChange?.(newDate);
    }
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <div className="flex items-center gap-2">
      <Select onValueChange={handlePresetChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Período" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Hoje</SelectItem>
          <SelectItem value="thisMonth">Este Mês</SelectItem>
          <SelectItem value="lastMonth">Mês Passado</SelectItem>
          <SelectItem value="last3Months">Últimos 3 Meses</SelectItem>
          <SelectItem value="year">Este Ano</SelectItem>
        </SelectContent>
      </Select>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !internalDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {internalDate?.from ? (
              internalDate.to ? (
                <>
                  {format(internalDate.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                  {format(internalDate.to, "dd/MM/yyyy", { locale: ptBR })}
                </>
              ) : (
                format(internalDate.from, "dd/MM/yyyy", { locale: ptBR })
              )
            ) : (
              <span>Selecione uma data</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={internalDate?.from}
            selected={internalDate}
            onSelect={(d) => {
                setInternalDate(d);
                if (d?.from && d?.to) {
                    onDateChange?.(d);
                }
            }}
            numberOfMonths={2}
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
      </div>
    </div>
  )
}
