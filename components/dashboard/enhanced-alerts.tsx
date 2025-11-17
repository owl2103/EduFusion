"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle2, Clock, Bell, Search, X } from "lucide-react"

const alertsData = [
  {
    id: 1,
    title: "Low Attendance Alert",
    description: "Student Rajesh Kumar has attendance below 80% in Mathematics",
    severity: "critical",
    timestamp: "2 minutes ago",
    read: false,
    category: "attendance",
  },
  {
    id: 2,
    title: "Exam Schedule Released",
    description: "Final exams schedule has been released for Grade 10-A",
    severity: "info",
    timestamp: "15 minutes ago",
    read: false,
    category: "exam",
  },
  {
    id: 3,
    title: "Performance Improvement Needed",
    description: "Class Grade 9-B requires intervention in Physics module",
    severity: "warning",
    timestamp: "1 hour ago",
    read: true,
    category: "performance",
  },
  {
    id: 4,
    title: "New Assignment Posted",
    description: "Dr. Sarah Johnson has posted new Chemistry assignment",
    severity: "info",
    timestamp: "2 hours ago",
    read: true,
    category: "assignment",
  },
  {
    id: 5,
    title: "Teacher Absence",
    description: "Mathematics teacher absence on 2025-01-15",
    severity: "warning",
    timestamp: "3 hours ago",
    read: true,
    category: "staffing",
  },
  {
    id: 6,
    title: "Student Achievement",
    description: "Priya Desai has achieved 100% in Calculus test",
    severity: "success",
    timestamp: "5 hours ago",
    read: true,
    category: "achievement",
  },
]

export function EnhancedAlerts() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSeverity, setSelectedSeverity] = useState("all")
  const [alerts, setAlerts] = useState(alertsData)
  const [deletedAlerts, setDeletedAlerts] = useState<number[]>([])

  const filteredAlerts = alerts.filter((alert) => {
    if (deletedAlerts.includes(alert.id)) return false
    const matchesSearch =
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSeverity = selectedSeverity === "all" || alert.severity === selectedSeverity
    return matchesSearch && matchesSeverity
  })

  const unreadCount = filteredAlerts.filter((a) => !a.read).length
  const criticalCount = filteredAlerts.filter((a) => a.severity === "critical").length

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "warning":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30"
      case "success":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
      case "info":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertCircle className="w-5 h-5" />
      case "warning":
        return <Clock className="w-5 h-5" />
      case "success":
        return <CheckCircle2 className="w-5 h-5" />
      case "info":
        return <Bell className="w-5 h-5" />
      default:
        return <Bell className="w-5 h-5" />
    }
  }

  const handleDelete = (id: number) => {
    setDeletedAlerts([...deletedAlerts, id])
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active Alerts</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        {/* Active Alerts Tab */}
        <TabsContent value="active" className="space-y-6">
          {/* Alert Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Critical Alerts</p>
                    <p className="text-3xl font-bold text-red-400">{criticalCount}</p>
                  </div>
                  <AlertCircle className="w-12 h-12 text-red-400/30" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Unread Alerts</p>
                    <p className="text-3xl font-bold text-blue-400">{unreadCount}</p>
                  </div>
                  <Bell className="w-12 h-12 text-blue-400/30" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Alerts</p>
                    <p className="text-3xl font-bold text-emerald-400">{filteredAlerts.length}</p>
                  </div>
                  <Bell className="w-12 h-12 text-emerald-400/30" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="px-3 py-2 rounded-md bg-white/5 border border-white/10 text-sm text-foreground hover:bg-white/10 transition-colors"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
              <option value="success">Success</option>
            </select>
          </div>

          {/* Alerts List */}
          <div className="space-y-3">
            {filteredAlerts.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">No alerts matching your criteria</p>
                </CardContent>
              </Card>
            ) : (
              filteredAlerts.map((alert) => (
                <Card
                  key={alert.id}
                  className={`border backdrop-blur-xl transition-all duration-300 hover:border-white/30 ${
                    alert.read ? "bg-white/5 border-white/10" : "bg-white/10 border-white/20"
                  }`}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
                          {getSeverityIcon(alert.severity)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{alert.title}</h4>
                            {!alert.read && <Badge className="bg-purple-500/30 text-purple-300 text-xs">New</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                          <p className="text-xs text-muted-foreground mt-2">{alert.timestamp}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(alert.id)}
                        className="hover:bg-red-500/20 hover:text-red-400"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alert History</CardTitle>
              <CardDescription>Archive of all alerts from the past month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">Alert history will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Customize how you receive alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[
                  { label: "Critical Alerts", description: "Receive notifications for critical issues" },
                  { label: "Performance Updates", description: "Receive performance metric updates" },
                  { label: "Student Achievements", description: "Receive notifications for student achievements" },
                  { label: "Attendance Alerts", description: "Receive attendance-related notifications" },
                  { label: "System Updates", description: "Receive system and maintenance updates" },
                ].map((pref, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div>
                      <p className="font-medium text-sm">{pref.label}</p>
                      <p className="text-xs text-muted-foreground">{pref.description}</p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
