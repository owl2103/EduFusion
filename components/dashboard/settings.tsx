"use client"

import { useState } from "react"
import { Save, Lock, Bell, FileText, Palette } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function Settings() {
  const [activeTab, setActiveTab] = useState("general")
  const [formData, setFormData] = useState({
    institutionName: "EduFusion Academy",
    email: "admin@edufusion.com",
    phone: "+1 (555) 123-4567",
    address: "123 Education Street, Learning City, LC 12345",
    country: "United States",
    timezone: "EST",
    language: "English",
    notificationsEmail: true,
    notificationsSMS: false,
    notificationsPush: true,
    darkMode: true,
    dataRetention: "24months",
    twoFactorAuth: true,
    sessionTimeout: "30",
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    console.log("Settings saved:", formData)
    // Here you would typically call an API to save settings
  }

  const renderContent = () => {
    switch (activeTab) {
      case "general":
        return (
          <div className="space-y-6">
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg border-border/50">
              <CardHeader>
                <CardTitle>Institution Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Institution Name</label>
                  <input
                    type="text"
                    value={formData.institutionName}
                    onChange={(e) => handleInputChange("institutionName", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-border/50 text-foreground outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-border/50 text-foreground outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-border/50 text-foreground outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-border/50 text-foreground outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Country</label>
                    <select
                      value={formData.country}
                      onChange={(e) => handleInputChange("country", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-border/50 text-foreground outline-none focus:border-primary/50 transition-colors"
                    >
                      <option>United States</option>
                      <option>Canada</option>
                      <option>India</option>
                      <option>UK</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Timezone</label>
                    <select
                      value={formData.timezone}
                      onChange={(e) => handleInputChange("timezone", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-border/50 text-foreground outline-none focus:border-primary/50 transition-colors"
                    >
                      <option>EST</option>
                      <option>CST</option>
                      <option>MST</option>
                      <option>PST</option>
                      <option>IST</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Language</label>
                    <select
                      value={formData.language}
                      onChange={(e) => handleInputChange("language", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-border/50 text-foreground outline-none focus:border-primary/50 transition-colors"
                    >
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>Hindi</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "notifications":
        return (
          <div className="space-y-6">
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  Notification Channels
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-border/50">
                  <div>
                    <div className="font-medium text-foreground">Email Notifications</div>
                    <div className="text-sm text-muted-foreground">Receive alerts via email</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.notificationsEmail}
                    onChange={(e) => handleInputChange("notificationsEmail", e.target.checked)}
                    className="w-5 h-5 rounded cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-border/50">
                  <div>
                    <div className="font-medium text-foreground">SMS Notifications</div>
                    <div className="text-sm text-muted-foreground">Receive alerts via SMS</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.notificationsSMS}
                    onChange={(e) => handleInputChange("notificationsSMS", e.target.checked)}
                    className="w-5 h-5 rounded cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-border/50">
                  <div>
                    <div className="font-medium text-foreground">Push Notifications</div>
                    <div className="text-sm text-muted-foreground">Receive in-app alerts</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.notificationsPush}
                    onChange={(e) => handleInputChange("notificationsPush", e.target.checked)}
                    className="w-5 h-5 rounded cursor-pointer"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "security":
        return (
          <div className="space-y-6">
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-primary" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-border/50">
                  <div>
                    <div className="font-medium text-foreground">Two-Factor Authentication</div>
                    <div className="text-sm text-muted-foreground">Add extra security to your account</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.twoFactorAuth}
                    onChange={(e) => handleInputChange("twoFactorAuth", e.target.checked)}
                    className="w-5 h-5 rounded cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Session Timeout (minutes)</label>
                  <input
                    type="number"
                    value={formData.sessionTimeout}
                    onChange={(e) => handleInputChange("sessionTimeout", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-border/50 text-foreground outline-none focus:border-primary/50 transition-colors"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Automatically log out after this period of inactivity
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Data Retention Policy</label>
                  <select
                    value={formData.dataRetention}
                    onChange={(e) => handleInputChange("dataRetention", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-border/50 text-foreground outline-none focus:border-primary/50 transition-colors"
                  >
                    <option value="6months">6 Months</option>
                    <option value="12months">1 Year</option>
                    <option value="24months">2 Years</option>
                    <option value="indefinite">Indefinite</option>
                  </select>
                </div>

                <Button className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30">
                  Change Password
                </Button>
              </CardContent>
            </Card>
          </div>
        )

      case "appearance":
        return (
          <div className="space-y-6">
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-primary" />
                  Appearance Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-border/50">
                  <div>
                    <div className="font-medium text-foreground">Dark Mode</div>
                    <div className="text-sm text-muted-foreground">Use dark theme for the dashboard</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.darkMode}
                    onChange={(e) => handleInputChange("darkMode", e.target.checked)}
                    disabled
                    className="w-5 h-5 rounded cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">Accent Color</label>
                  <div className="flex gap-3">
                    {[
                      { name: "Blue", color: "bg-blue-500" },
                      { name: "Purple", color: "bg-purple-500" },
                      { name: "Teal", color: "bg-teal-500" },
                      { name: "Green", color: "bg-green-500" },
                    ].map((option) => (
                      <button
                        key={option.name}
                        className={`w-10 h-10 rounded-lg ${option.color} opacity-70 hover:opacity-100 transition-opacity`}
                        title={option.name}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        {[
          { id: "general", label: "General", icon: FileText },
          { id: "notifications", label: "Notifications", icon: Bell },
          { id: "security", label: "Security", icon: Lock },
          { id: "appearance", label: "Appearance", icon: Palette },
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-primary to-accent text-white"
                  : "bg-white/5 text-foreground hover:bg-white/10"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {renderContent()}

      <div className="flex gap-3 justify-end">
        <Button variant="outline" className="border-border/50 bg-transparent">
          Cancel
        </Button>
        <Button onClick={handleSave} className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90">
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </div>
    </div>
  )
}
