import React from "react"
import { UserDto } from "@yellowbird-holdings/camelhumps-types"

import { User } from "@/types/temp-types"
import apiCamelback from "@/lib/api/apiCamelback"
import { AUTH_TOKEN_KEY } from "@/lib/constants"
import { useUserStore } from "@/lib/store/user"
import { setStorageItemAsync, useStorageState } from "@/hooks/use-storage-state"
import { SignInSchema } from "@/app/sign-in"

type AuthContextType = {
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: SignInSchema) => Promise<void>
  logout: () => Promise<void>
}

interface LoginResponse {
  token: string
  user: User
}

const AuthContext = React.createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)
  const [[loading, token]] = useStorageState(AUTH_TOKEN_KEY)
  const { user, setUser } = useUserStore()

  React.useEffect(() => {
    // Check for existing token
    checkAuthStatus()
  }, [loading])

  async function checkAuthStatus() {
    try {
      if (!token || !user) {
        setIsAuthenticated(false)
        setIsLoading(false)
        return
      }

      setIsAuthenticated(true)
      setIsLoading(false)
    } catch (error) {
      console.error("Auth check failed:", error)
      setIsAuthenticated(false)
      setIsLoading(false)
    }
  }

  async function login(credentials: SignInSchema) {
    try {
      setIsLoading(true)
      const response = await apiCamelback.post<LoginResponse>(
        "/api/v1/auth",
        credentials
      )
      const { token, user } = response.data

      await setStorageItemAsync(AUTH_TOKEN_KEY, token)
      setUser(user)
      setIsAuthenticated(true)
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  async function logout() {
    try {
      setIsLoading(true)
      await setStorageItemAsync(AUTH_TOKEN_KEY, null)
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
