import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  variant?: "default" | "success" | "danger" | "warning"
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  trendValue,
  variant = "default",
}: StatsCardProps) {
  
  const variantStyles = {
      default: "text-muted-foreground",
      success: "text-success",
      danger: "text-destructive",
      warning: "text-warning"
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <Icon className={cn("h-4 w-4", variantStyles[variant])} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || trendValue) && (
          <p className="text-xs text-muted-foreground mt-1">
            {trend && (
                <span className={cn(
                    "mr-1 font-medium",
                    trend === "up" ? "text-success" : trend === "down" ? "text-destructive" : ""
                )}>
                    {trend === "up" ? "↑" : trend === "down" ? "↓" : "•"} {trendValue}
                </span>
            )}
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
