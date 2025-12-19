"use client"

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { useTheme } from "next-themes"

interface BarChartProps {
  data: any[]
  xAxisKey: string
  bars: {
    key: string
    color: string
    name?: string
    stackId?: string
  }[]
  height?: number
}

export function BarChart({ data, xAxisKey, bars, height = 300 }: BarChartProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
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
             cursor={{fill: isDark ? "#374151" : "#f3f4f6", opacity: 0.4}}
          />
          <Legend />
          {bars.map((bar) => (
             <Bar
               key={bar.key}
               dataKey={bar.key}
               fill={bar.color}
               name={bar.name || bar.key}
               radius={[4, 4, 0, 0]}
               stackId={bar.stackId}
             />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}
