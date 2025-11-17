"use client"

import { Card } from "@/components/ui/card"
import { AlertCircle, TrendingDown, BookOpen, Users } from "lucide-react"

export function AIInsightsFeed() {
  const insights = [
    {
      icon: AlertCircle,
      title: "Math Performance Alert",
      message: "Class 10B shows declining trend in Mathematics",
      action: "Suggest remedial session",
      severity: "high",
    },
    {
      icon: TrendingDown,
      title: "Attendance Warning",
      message: "5 students in Class 9A have 3+ absences",
      action: "Notify parents",
      severity: "medium",
    },
    {
      icon: BookOpen,
      title: "Curriculum Gap",
      message: "Chemistry practical labs 20% behind schedule",
      action: "Request lesson plan",
      severity: "medium",
    },
    {
      icon: Users,
      title: "Teacher Feedback",
      message: "Mr. Sharma showing 15% improvement in student engagement",
      action: "View report",
      severity: "low",
    },
  ]

  return (
    <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-6 h-full flex flex-col">
      <h3 className="text-lg font-bold mb-4 text-foreground">AI Insights</h3>
      <div className="space-y-3 flex-1 overflow-y-auto">
        {insights.map((insight, idx) => {
          const Icon = insight.icon
          const bgColor = {
            high: "bg-red-500/10 border-red-500/30",
            medium: "bg-yellow-500/10 border-yellow-500/30",
            low: "bg-green-500/10 border-green-500/30",
          }[insight.severity]

          return (
            <div
              key={idx}
              className={`p-3 rounded-lg border ${bgColor} hover:bg-white/10 transition-colors cursor-pointer`}
            >
              <div className="flex gap-3">
                <Icon className="w-5 h-5 flex-shrink-0 mt-1 text-accent" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{insight.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{insight.message}</p>
                  <button className="text-xs text-primary hover:text-accent mt-2 font-medium">
                    {insight.action} →
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
