"use client"

import { useState } from "react"
import { Download, Calendar, TrendingUp, Users, BookOpen } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export function Reports() {
  const [reportType, setReportType] = useState("performance")
  const [dateRange, setDateRange] = useState("month")

  const performanceData = [
    { month: "Jan", students: 85, teachers: 88, curriculum: 82 },
    { month: "Feb", students: 87, teachers: 90, curriculum: 85 },
    { month: "Mar", students: 89, teachers: 92, curriculum: 88 },
    { month: "Apr", students: 91, teachers: 94, curriculum: 90 },
    { month: "May", students: 93, teachers: 95, curriculum: 92 },
    { month: "Jun", students: 95, teachers: 96, curriculum: 94 },
  ]

  const attendanceData = [
    { month: "Jan", attendance: 94 },
    { month: "Feb", attendance: 95 },
    { month: "Mar", attendance: 93 },
    { month: "Apr", attendance: 96 },
    { month: "May", attendance: 97 },
    { month: "Jun", attendance: 98 },
  ]

  const gradeDistribution = [
    { name: "A", value: 35, color: "#10b981" },
    { name: "B", value: 30, color: "#3b82f6" },
    { name: "C", value: 20, color: "#f59e0b" },
    { name: "D", value: 10, color: "#ef4444" },
    { name: "F", value: 5, color: "#6b7280" },
  ]

  const renderReport = () => {
    switch (reportType) {
      case "performance":
        return (
          <div className="space-y-6">
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Performance Trends Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0,0,0,0.8)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="students"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: "#3b82f6" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="teachers"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ fill: "#10b981" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="curriculum"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      dot={{ fill: "#f59e0b" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Student Performance Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Average Score</span>
                    <span className="text-xl font-bold text-primary">92.3%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Pass Rate</span>
                    <span className="text-xl font-bold text-green-400">98.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Students Improved</span>
                    <span className="text-xl font-bold text-blue-400">156</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Teacher Performance Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Average Rating</span>
                    <span className="text-xl font-bold text-primary">4.6/5.0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Active Teachers</span>
                    <span className="text-xl font-bold text-purple-400">48</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Classes Teaching</span>
                    <span className="text-xl font-bold text-cyan-400">156</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case "attendance":
        return (
          <div className="space-y-6">
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Attendance Rate Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0,0,0,0.8)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="attendance" fill="#10b981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg border-border/50">
              <CardHeader>
                <CardTitle>Attendance Breakdown by Class</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { class: "Grade 10-A", attendance: 98, students: 45 },
                    { class: "Grade 10-B", attendance: 96, students: 42 },
                    { class: "Grade 11-A", attendance: 95, students: 48 },
                    { class: "Grade 11-B", attendance: 97, students: 43 },
                  ].map((item) => (
                    <div key={item.class} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-foreground">{item.class}</div>
                        <div className="text-sm text-muted-foreground">{item.students} students</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-accent"
                            style={{ width: `${item.attendance}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-primary">{item.attendance}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "grades":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg border-border/50">
                <CardHeader>
                  <CardTitle>Grade Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={gradeDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {gradeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg border-border/50">
                <CardHeader>
                  <CardTitle>Grade Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {gradeDistribution.map((grade) => (
                    <div key={grade.name} className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: grade.color }}></div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">Grade {grade.name}</span>
                          <span className="text-sm text-muted-foreground">{grade.value}%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-accent"
                            style={{ width: `${grade.value * 2}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {[
            { id: "performance", label: "Performance" },
            { id: "attendance", label: "Attendance" },
            { id: "grades", label: "Grades" },
          ].map((report) => (
            <button
              key={report.id}
              onClick={() => setReportType(report.id)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                reportType === report.id
                  ? "bg-gradient-to-r from-primary to-accent text-white"
                  : "bg-white/5 text-foreground hover:bg-white/10"
              }`}
            >
              {report.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white/5 border border-border/50 text-foreground outline-none"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>

          <Button className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      {renderReport()}
    </div>
  )
}
