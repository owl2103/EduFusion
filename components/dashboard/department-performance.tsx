"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { TrendingUp, Users, BookOpen } from "lucide-react"

const departmentsData = [
  {
    name: "Science",
    avgPerformance: 82,
    students: 234,
    teachers: 12,
    trend: "up",
    subjects: [
      { name: "Physics", performance: 81, students: 78 },
      { name: "Chemistry", performance: 84, students: 82 },
      { name: "Biology", performance: 82, students: 74 },
    ],
  },
  {
    name: "Mathematics",
    avgPerformance: 76,
    students: 201,
    teachers: 10,
    trend: "up",
    subjects: [
      { name: "Algebra", performance: 75, students: 68 },
      { name: "Geometry", performance: 78, students: 65 },
      { name: "Calculus", performance: 76, students: 68 },
    ],
  },
  {
    name: "Humanities",
    avgPerformance: 79,
    students: 207,
    teachers: 9,
    trend: "stable",
    subjects: [
      { name: "English", performance: 79, students: 92 },
      { name: "History", performance: 81, students: 58 },
      { name: "Geography", performance: 75, students: 57 },
    ],
  },
  {
    name: "Commerce",
    avgPerformance: 77,
    students: 189,
    teachers: 8,
    trend: "down",
    subjects: [
      { name: "Economics", performance: 78, students: 61 },
      { name: "Accountancy", performance: 76, students: 64 },
      { name: "Business Studies", performance: 77, students: 64 },
    ],
  },
]

const radarData = [
  { category: "Science", A: 82, B: 75 },
  { category: "Math", A: 76, B: 72 },
  { category: "English", A: 79, B: 77 },
  { category: "History", A: 81, B: 78 },
  { category: "Commerce", A: 77, B: 74 },
]

export function DepartmentPerformance() {
  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-emerald-400"
      case "down":
        return "text-red-400"
      default:
        return "text-amber-400"
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {departmentsData.map((dept) => (
              <Card
                key={dept.name}
                className="border border-white/10 backdrop-blur-xl bg-white/5 hover:border-white/20 transition-all duration-300"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{dept.name}</CardTitle>
                    <Badge className={getTrendColor(dept.trend) + " text-xs"}>
                      {dept.trend === "up" && "↑ Up"}
                      {dept.trend === "down" && "↓ Down"}
                      {dept.trend === "stable" && "→ Stable"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Performance</p>
                    <p
                      className={`text-2xl font-bold ${dept.avgPerformance >= 80 ? "text-emerald-400" : "text-amber-400"}`}
                    >
                      {dept.avgPerformance}%
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-400" />
                      <div>
                        <p className="text-xs text-muted-foreground">Students</p>
                        <p className="font-semibold">{dept.students}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-purple-400" />
                      <div>
                        <p className="text-xs text-muted-foreground">Teachers</p>
                        <p className="font-semibold">{dept.teachers}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Department Performance Chart */}
          <Card className="border border-white/10 backdrop-blur-xl bg-white/5">
            <CardHeader>
              <CardTitle>Department Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.95)",
                      border: "1px solid rgba(255,255,255,0.2)",
                    }}
                  />
                  <Bar dataKey="avgPerformance" fill="#8b5cf6" radius={[8, 8, 0, 0]}>
                    {departmentsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={["#8b5cf6", "#06b6d4", "#10b981", "#f59e0b"][index % 4]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Comparison Tab */}
        <TabsContent value="comparison" className="space-y-6">
          <Card className="border border-white/10 backdrop-blur-xl bg-white/5">
            <CardHeader>
              <CardTitle>Performance Radar Analysis</CardTitle>
              <CardDescription>Multi-dimensional performance comparison across departments</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="category" stroke="rgba(255,255,255,0.5)" />
                  <PolarRadiusAxis stroke="rgba(255,255,255,0.5)" />
                  <Radar name="Current Year" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                  <Radar name="Previous Year" dataKey="B" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.6} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.95)",
                      border: "1px solid rgba(255,255,255,0.2)",
                    }}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6">
          {departmentsData.map((dept) => (
            <Card key={dept.name} className="border border-white/10 backdrop-blur-xl bg-white/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  {dept.name} Department
                </CardTitle>
                <CardDescription>Subject-wise performance breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {dept.subjects.map((subject) => (
                    <Card key={subject.name} className="bg-white/5 border border-white/10">
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          <p className="font-semibold">{subject.name}</p>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Performance</span>
                              <span className="font-bold text-purple-400">{subject.performance}%</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-purple-400 to-blue-400 h-2 rounded-full"
                                style={{ width: `${subject.performance}%` }}
                              />
                            </div>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground pt-2">
                            <span>Students: {subject.students}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
