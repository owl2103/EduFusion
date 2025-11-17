"use client"

import { Card } from "@/components/ui/card"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export function PerformanceCharts() {
  const lineData = [
    { month: "Jan", score: 72, attendance: 92 },
    { month: "Feb", score: 74, attendance: 93 },
    { month: "Mar", score: 76, attendance: 94 },
    { month: "Apr", score: 75, attendance: 93 },
    { month: "May", score: 78, attendance: 95 },
    { month: "Jun", score: 78.5, attendance: 94.2 },
  ]

  const departmentData = [
    { name: "Science", value: 82 },
    { name: "Math", value: 76 },
    { name: "English", value: 79 },
    { name: "History", value: 81 },
    { name: "Languages", value: 75 },
  ]

  const completionData = [
    { name: "Completed", value: 87.6 },
    { name: "In Progress", value: 9.2 },
    { name: "Not Started", value: 3.2 },
  ]

  const colors = ["#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"]
  const pieColors = ["#8b5cf6", "#06b6d4", "#6b7280"]

  return (
    <div className="space-y-6">
      <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4 text-foreground">Score vs Attendance Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis stroke="rgba(255,255,255,0.5)" />
            <YAxis stroke="rgba(255,255,255,0.5)" />
            <Tooltip
              contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.9)", border: "1px solid rgba(255,255,255,0.2)" }}
            />
            <Legend />
            <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: "#8b5cf6" }} />
            <Line type="monotone" dataKey="attendance" stroke="#06b6d4" strokeWidth={2} dot={{ fill: "#06b6d4" }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4 text-foreground">Department Performance</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip
                contentStyle={{ backgroundColor: "rgba(15, 23, 42, 0.9)", border: "1px solid rgba(255,255,255,0.2)" }}
              />
              <Bar dataKey="value" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4 text-foreground">Curriculum Completion</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={completionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {completionData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  )
}
