"use client"

import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { useTheme } from "next-themes"

interface PieChartProps {
  data: any[]
  nameKey: string
  dataKey: string
  colors?: string[]
  height?: number
}

const DEFAULT_COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

export function PieChart({ data, nameKey, dataKey, colors = DEFAULT_COLORS, height = 300 }: PieChartProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey={dataKey}
            nameKey={nameKey}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip 
             contentStyle={{ 
                 backgroundColor: isDark ? "#1f2937" : "#fff",
                 border: "1px solid " + (isDark ? "#374151" : "#e5e7eb"),
                 borderRadius: "8px"
             }}
             formatter={(value: number) => `R$ ${value.toFixed(2)}`}
          />
          <Legend />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  )
}
