"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, Lock, User, Mail, Phone, Sparkles, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"

export function AuthOverlay() {
  const { user, login, register, isLoading } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    username: "",
    password: "",
  })

  if (isLoading || user) return null

  const validatePassword = (pass: string) => {
    const hasNumber = /\d/.test(pass)
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass)
    return pass.length >= 8 && hasNumber && hasSpecial
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (isLogin) {
      const success = await login(formData.username, formData.password)
      if (!success) setError("Invalid username or password")
    } else {
      if (!formData.name || !formData.email || !formData.username) {
        setError("Please fill all required fields")
        return
      }
      if (!validatePassword(formData.password)) {
        setError("Password must be 8+ characters, include a number and a special symbol.")
        return
      }
      const success = await register({
        name: formData.name,
        contact: formData.contact,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        walletBalance: 0,
        holdings: [],
        watchlists: [],
        tradeHistory: [],
        walletHistory: []
      })
      if (!success) setError("Username already exists")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md px-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="border-primary/20 shadow-2xl shadow-primary/10">
          <CardHeader className="text-center space-y-1">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-primary flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">
              {isLogin ? "Welcome Back to CoreVault" : "Join CoreVault AI"}
            </CardTitle>
            <CardDescription>
              {isLogin ? "Enter your credentials to access your dashboard" : "Create your secure account to start investing with AI"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-4 overflow-hidden"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          placeholder="John Doe"
                          className="pl-10"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="user@example.com"
                            className="pl-10"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact">Contact No.</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="contact"
                            placeholder="+91 0000000000"
                            className="pl-10"
                            value={formData.contact}
                            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    placeholder="investor_01"
                    className="pl-10"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
                {!isLogin && formData.password && (
                   <p className={`text-xs flex items-center gap-1 ${validatePassword(formData.password) ? "text-success" : "text-destructive"}`}>
                     {validatePassword(formData.password) ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                     Min 8 chars, 1 number, 1 symbol
                   </p>
                )}
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-destructive font-medium flex items-center gap-2"
                >
                  <AlertCircle className="h-4 w-4" /> {error}
                </motion.p>
              )}

              <Button type="submit" className="w-full group">
                {isLogin ? "Login to Account" : "Create Account"}
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary font-semibold hover:underline"
                >
                  {isLogin ? "Sign Up" : "Login"}
                </button>
              </p>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
