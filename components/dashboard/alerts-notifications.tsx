"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { AlertCircle, Bell, CheckCircle2, Clock, Trash2, Filter, Search, Mail, MessageSquare } from "lucide-react"

const alertsData = [
  {
    id: 1,
    type: "critical",
    title: "Low Attendance Alert",
    description: "Alex Martin (Grade 10-A) has missed 3 consecutive classes",
    timestamp: "2 hours ago",
    read: false,
    actionable: true,
    subject: "Mathematics 10-A",
  },
  {
    id: 2,
    type: "warning",
    title: "Assignment Not Submitted",
    description: "15 students in Physics 11-B have not submitted the midterm assignment",
    timestamp: "4 hours ago",
    read: false,
    actionable: true,
    subject: "Physics 11-B",
  },
  {
    id: 3,
    type: "info",
    title: "Curriculum Unit Completed",
    description: "Trigonometry unit in Mathematics 10-A has been completed",
    timestamp: "1 day ago",
    read: true,
    actionable: false,
    subject: "Mathematics 10-A",
  },
  {
    id: 4,
    type: "critical",
    title: "Teacher Absence",
    description: "Michael Chen is unavailable on Feb 20. Substitute teacher assigned.",
    timestamp: "1 day ago",
    read: true,
    actionable: true,
    subject: "Physics",
  },
  {
    id: 5,
    type: "warning",
    title: "Performance Below Average",
    description: "Isabella Lee (Grade 11-B) performance dropped to 7.5 in Physics",
    timestamp: "2 days ago",
    read: true,
    actionable: true,
    subject: "Physics 11-B",
  },
  {
    id: 6,
    type: "info",
    title: "System Maintenance",
    description: "Scheduled maintenance on Feb 25 from 11 PM to 1 AM",
    timestamp: "3 days ago",
    read: true,
    actionable: false,
    subject: "System",
  },
  {
    id: 7,
    type: "critical",
    title: "Grade Anomaly Detected",
    description: "Unusual grade spike detected for 8 students in English 9-C",
    timestamp: "3 days ago",
    read: true,
    actionable: true,
    subject: "English Literature",
  },
]

const notificationSettings = [
  {
    id: 1,
    category: "Attendance Alerts",
    description: "Notifications for student absences and attendance issues",
    enabled: true,
    channels: ["Email", "In-App"],
  },
  {
    id: 2,
    category: "Performance Alerts",
    description: "Alerts for students with declining performance",
    enabled: true,
    channels: ["Email", "In-App"],
  },
  {
    id: 3,
    category: "Assignment Updates",
    description: "Notifications about assignment submissions and deadlines",
    enabled: true,
    channels: ["In-App"],
  },
  {
    id: 4,
    category: "System Updates",
    description: "Important system maintenance and updates",
    enabled: false,
    channels: ["Email"],
  },
  {
    id: 5,
    category: "Curriculum Progress",
    description: "Notifications for curriculum and lesson completions",
    enabled: true,
    channels: ["In-App"],
  },
  {
    id: 6,
    category: "Teacher Availability",
    description: "Alerts about teacher absences and substitutions",
    enabled: true,
    channels: ["Email", "In-App"],
  },
]

export function AlertsNotifications() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [readFilter, setReadFilter] = useState("all")
  const [notifications, setNotifications] = useState(alertsData)
  const [settings, setSettings] = useState(notificationSettings)

  const filteredAlerts = notifications.filter((alert) => {
    const matchesSearch =
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || alert.type === selectedType
    const matchesRead =
      readFilter === "all" || (readFilter === "unread" && !alert.read) || (readFilter === "read" && alert.read)
    return matchesSearch && matchesType && matchesRead
  })

  const unreadCount = notifications.filter((a) => !a.read).length
  const criticalCount = notifications.filter((a) => a.type === "critical" && !a.read).length

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertCircle className="w-5 h-5 text-red-400" />
      case "warning":
        return <AlertCircle className="w-5 h-5 text-amber-400" />
      case "info":
        return <Bell className="w-5 h-5 text-blue-400" />
      default:
        return <Bell className="w-5 h-5 text-muted-foreground" />
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case "critical":
        return "bg-red-500/20 text-red-400"
      case "warning":
        return "bg-amber-500/20 text-amber-400"
      case "info":
        return "bg-blue-500/20 text-blue-400"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const markAsRead = (id: number) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const toggleNotificationSetting = (id: number) => {
    setSettings(settings.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)))
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="alerts" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="alerts">
            Alerts
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-6">
          {/* Alert Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{unreadCount}</div>
                  <p className="text-sm text-muted-foreground mt-1">Unread Alerts</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-400">{criticalCount}</div>
                  <p className="text-sm text-muted-foreground mt-1">Critical</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-400">
                    {notifications.filter((a) => a.type === "warning").length}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Warnings</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">
                    {notifications.filter((a) => a.type === "info").length}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Info</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search alerts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full md:w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>
            <Select value={readFilter} onValueChange={setReadFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="read">Read</SelectItem>
              </SelectContent>
            </Select>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            )}
          </div>

          {/* Alerts List */}
          <div className="space-y-3">
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((alert) => (
                <Card
                  key={alert.id}
                  className={`cursor-pointer transition-all ${alert.read ? "opacity-75" : "border-primary/50"}`}
                  onClick={() => !alert.read && markAsRead(alert.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">{getAlertIcon(alert.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-semibold">{alert.title}</h3>
                          {!alert.read && <div className="w-2 h-2 rounded-full bg-primary ml-2 mt-1" />}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="text-xs">
                            {alert.subject}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {alert.timestamp}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {alert.actionable && (
                          <Button variant="outline" size="sm">
                            Action
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteNotification(alert.id)
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">No alerts found</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alert History</CardTitle>
              <CardDescription>All alerts and notifications from the past 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border/50"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <p className="font-medium text-sm">{alert.title}</p>
                        <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                      </div>
                    </div>
                    <Badge className={getAlertColor(alert.type)} variant="secondary">
                      {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
                    </Badge>
                    {alert.read && <CheckCircle2 className="w-4 h-4 text-green-400 ml-2" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Customize how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {settings.map((setting) => (
                <div key={setting.id} className="border-b border-border/50 pb-4 last:border-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{setting.category}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{setting.description}</p>
                    </div>
                    <Switch checked={setting.enabled} onCheckedChange={() => toggleNotificationSetting(setting.id)} />
                  </div>
                  <div className="flex gap-2 mt-3">
                    {setting.channels.map((channel, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {channel === "Email" && <Mail className="w-3 h-3 mr-1" />}
                        {channel === "In-App" && <Bell className="w-3 h-3 mr-1" />}
                        {channel}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alert Sensitivity</CardTitle>
              <CardDescription>Adjust the sensitivity of alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">Attendance Threshold</label>
                  <span className="text-sm font-semibold">80%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-4/5 bg-primary" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Alert when attendance falls below 80%</p>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">Performance Drop Threshold</label>
                  <span className="text-sm font-semibold">15%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-3/5 bg-primary" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Alert when performance drops more than 15%</p>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">Assignment Late Threshold</label>
                  <span className="text-sm font-semibold">2 days</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-2/5 bg-primary" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Alert when assignments are late by 2 days</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notification Channels</CardTitle>
              <CardDescription>Choose your preferred communication channels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5" />
                  <div>
                    <p className="font-medium text-sm">Email Notifications</p>
                    <p className="text-xs text-muted-foreground">Receive alerts via email</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5" />
                  <div>
                    <p className="font-medium text-sm">In-App Notifications</p>
                    <p className="text-xs text-muted-foreground">Receive alerts in the dashboard</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5" />
                  <div>
                    <p className="font-medium text-sm">SMS Notifications</p>
                    <p className="text-xs text-muted-foreground">Receive critical alerts via SMS</p>
                  </div>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
