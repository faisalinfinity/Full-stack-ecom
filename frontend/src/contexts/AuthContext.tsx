"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import axios from "axios"
import { useToast } from "../hooks/use-toast"

interface AuthContextType {
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (fullName: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { toast } = useToast()

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", { email, password })
      localStorage.setItem("token", response.data.token)
      setIsAuthenticated(true)
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      })
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      })
    }
  }

  const register = async (fullName: string, email: string, password: string) => {
    try {
      await axios.post("http://localhost:5000/api/auth/register", { fullName, email, password })
      toast({
        title: "Registration Successful",
        description: "You can now log in with your new account.",
      })
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "An error occurred during registration. Please try again.",
        variant: "destructive",
      })
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setIsAuthenticated(false)
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    })
  }

  return <AuthContext.Provider value={{ isAuthenticated, login, register, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

