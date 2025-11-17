"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function AddTeacherModal({
  open,
  onClose,
  onSubmit,
}: { open: boolean; onClose: () => void; onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    department: "",
    experience: 0,
    rating: 0,
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "experience" || name === "rating" ? Number.parseFloat(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        onSubmit(formData)
        setFormData({ name: "", email: "", subject: "", department: "", experience: 0, rating: 0 })
        onClose()
      }
    } catch (error) {
      console.error("Error adding teacher:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Add New Teacher</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field w-full"
              placeholder="Enter teacher name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field w-full"
              placeholder="Enter email"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="input-field w-full"
                placeholder="e.g., Mathematics"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="input-field w-full"
                placeholder="e.g., Science"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Experience (Years)</label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="input-field w-full"
                step="0.5"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Rating</label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                className="input-field w-full"
                step="0.1"
                max="5"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button type="button" onClick={onClose} className="button-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="button-primary">
              {loading ? "Adding..." : "Add Teacher"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
