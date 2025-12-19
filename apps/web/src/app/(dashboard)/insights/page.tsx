"use client"

import { useAI, Insight } from "@/hooks/use-ai"
import { PageHeader } from "@/components/shared/PageHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Info, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const SEVERITY_MAP = {
    'WARNING': { color: 'text-amber-500', bg: 'bg-amber-100', icon: AlertCircle },
    'DANGER': { color: 'text-red-500', bg: 'bg-red-100', icon: AlertCircle },
    'INFO': { color: 'text-blue-500', bg: 'bg-blue-100', icon: Info },
    'SUCCESS': { color: 'text-green-500', bg: 'bg-green-100', icon: CheckCircle },
}

export default function InsightsPage() {
  const { insights } = useAI()
  const list = insights.data || []

  return (
    <div className="space-y-6">
      <PageHeader
        title="Insights IA"
        description="Análises inteligentes das suas finanças"
        actions={<Button onClick={() => insights.refetch()}>Atualizar Análise</Button>}
      />
      
      {insights.isLoading && <div>Carregando insights...</div>}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((insight: Insight, idx: number) => {
              const config = SEVERITY_MAP[insight.severity] || SEVERITY_MAP['INFO']
              const Icon = config.icon

              return (
                  <Card key={idx} className="border-l-4" style={{ borderLeftColor: config.color.split('-')[1] }}>
                      <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                              <Badge variant="outline" className={`${config.bg} ${config.color} border-none`}>
                                  {insight.type}
                              </Badge>
                              <Icon className={`h-5 w-5 ${config.color}`} />
                          </div>
                          <CardTitle className="text-lg mt-2">{insight.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                              {insight.description}
                          </p>
                          {insight.suggestion && (
                              <div className="bg-muted/50 p-3 rounded-md text-sm">
                                  <span className="font-semibold block mb-1">Sugestão:</span>
                                  {insight.suggestion}
                              </div>
                          )}
                      </CardContent>
                  </Card>
              )
          })}
      </div>
    </div>
  )
}
