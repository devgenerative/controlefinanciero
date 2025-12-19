"use client"

import * as React from "react"
import { NumericFormat } from "react-number-format"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface MoneyInputProps {
  value?: number
  onChange?: (value: number | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function MoneyInput({
  value,
  onChange,
  placeholder = "R$ 0,00",
  className,
  disabled
}: MoneyInputProps) {
  return (
    <NumericFormat
      value={value}
      onValueChange={(values) => {
        onChange?.(values.floatValue)
      }}
      thousandSeparator="."
      decimalSeparator=","
      prefix="R$ "
      decimalScale={2}
      fixedDecimalScale
      allowNegative={false}
      customInput={Input}
      placeholder={placeholder}
      className={cn("text-lg font-semibold", className)}
      disabled={disabled}
    />
  )
}
