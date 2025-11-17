"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

export function KPICards() {
  const kpis = [
    {
      title: "Avg Student Score",
      value: "78.5%",
      change: "+2.3%",
      trend: "up",
      color: "from-blue-500 to-cyan-500",
      metric: "📊",
    },
    {
      title: "Dropout Risk",
      value: "12.4%",
      change: "-1.2%",
      trend: "down",
      color: "from-orange-500 to-red-500",
      metric: "⚠️",
    },
    {
      title: "Attendance %",
      value: "94.2%",
      change: "+0.8%",
      trend: "up",
      color: "from-green-500 to-emerald-500",
      metric: "✓",
    },
    {
      title: "Syllabus Completion",
      value: "87.6%",
      change: "+3.1%",
      trend: "up",
      color: "from-purple-500 to-pink-500",
      metric: "📚",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi) => (
        <Card
          key={kpi.title}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-6 hover:bg-white/15 transition-all duration-300"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">{kpi.title}</p>
              <h3 className="text-2xl font-bold text-foreground mb-3">{kpi.value}</h3>
              <div className="flex items-center gap-1">
                {kpi.trend === "up" ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-green-500" />
                )}
                <span className="text-sm font-medium text-green-500">{kpi.change}</span>
              </div>
            </div>
            <div className={`text-3xl`}>{kpi.metric}</div>
          </div>
        </Card>
      ))}
    </div>
  )
}
