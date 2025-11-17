"use client"

import { useState } from "react"
import { LoginPage } from "@/components/auth/login-page"
import { SignupPage } from "@/components/auth/signup-page"
import { AdminDashboard } from "@/components/dashboard/admin-dashboard"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showSignup, setShowSignup] = useState(false)

  if (isLoggedIn) {
    return <AdminDashboard onLogout={() => setIsLoggedIn(false)} />
  }

  if (showSignup) {
    return (
      <SignupPage
        onSignupSuccess={() => {
          // After successful signup, switch to login
          setShowSignup(false)
        }}
        onSwitchToLogin={() => setShowSignup(false)}
      />
    )
  }

  return (
    <LoginPage
      onLoginSuccess={() => setIsLoggedIn(true)}
      onSwitchToSignup={() => setShowSignup(true)}
    />
  )
}
