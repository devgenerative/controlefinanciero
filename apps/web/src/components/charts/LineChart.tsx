"use client"

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts"
import { useTheme } from "next-themes"

interface LineChartProps {
  data: any[]
  xAxisKey: string
  lines: {
    key: string
    color: string
    name?: string
  }[]
  height?: number
}

export function LineChart({ data, xAxisKey, lines, height = 300 }: LineChartProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <defs>
            {lines.map((line) => (
               <linearGradient key={line.key} id={`color${line.key}`} x1="0" y1="0" x2="0" y2="1">
                 <stop offset="5%" stopColor={line.color} stopOpacity={0.3}/>
                 <stop offset="95%" stopColor={line.color} stopOpacity={0}/>
               </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} vertical={false} />
          <XAxis 
            dataKey={xAxisKey} 
            stroke={isDark ? "#9ca3af" : "#6b7280"} 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
          />
          <YAxis 
            stroke={isDark ? "#9ca3af" : "#6b7280"} 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(value) => `R$ ${value}`}
          />
          <Tooltip 
             contentStyle={{ 
                 backgroundColor: isDark ? "#1f2937" : "#fff",
                 border: "1px solid " + (isDark ? "#374151" : "#e5e7eb"),
                 borderRadius: "8px"
             }}
          />
          <Legend />
          {lines.map((line) => (
             <Area
               key={line.key}
               type="monotone"
               dataKey={line.key}
               stroke={line.color}
               fillOpacity={1}
               fill={`url(#color${line.key})`}
               name={line.name || line.key}
             />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
