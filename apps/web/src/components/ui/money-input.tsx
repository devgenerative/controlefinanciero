"use client"

import * as React from "react"
import CurrencyInput, { CurrencyInputProps } from "react-currency-input-field"

import { cn } from "@/lib/utils"

export interface MoneyInputProps extends Omit<CurrencyInputProps, "onValueChange"> {
  onValueChange?: (value: number | undefined) => void
}

const MoneyInput = React.forwardRef<HTMLInputElement, MoneyInputProps>(
  ({ className, onValueChange, ...props }, ref) => {
    return (
      <CurrencyInput
        decimalsLimit={2}
        decimalScale={2}
        prefix="R$ "
        groupSeparator="."
        decimalSeparator=","
        allowNegativeValue={false}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        onValueChange={(value) => {
             if (value) {
                 // Replace comma with dot for proper parsing if needed, though lib handles usually
                 // The value returned by lib is string like "1000,50" or undefined
                 // We need to convert to number format JS understands (dot)
                 const numberVal = parseFloat(value.replace(",", "."))
                 onValueChange?.(isNaN(numberVal) ? undefined : numberVal)
             } else {
                 onValueChange?.(undefined)
             }
        }}
        ref={ref}
        {...props}
      />
    )
  }
)
MoneyInput.displayName = "MoneyInput"

export { MoneyInput }
