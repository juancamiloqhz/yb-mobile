import React from "react"
import { router } from "expo-router"

import { User } from "@/types/temp-types"
import apiCamelback from "@/lib/api/api-camelback"
import { AUTH_TOKEN_KEY } from "@/lib/constants"
import { useUserStore } from "@/lib/store/user"
import { setStorageItemAsync, useStorageState } from "@/hooks/use-storage-state"
import { SignInSchema } from "@/app/sign-in"

type AuthContextType = {
  isLoading: boolean
  signIn: (credentials: SignInSchema) => Promise<void>
  signOut: () => Promise<void>
  isAuthenticated: boolean
}

interface LoginResponse {
  token: string
  user: User
}

const AuthContext = React.createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [[isLoading, token]] = useStorageState(AUTH_TOKEN_KEY)
  const { setUser } = useUserStore()

  const signIn = React.useCallback(async (credentials: SignInSchema) => {
    try {
      const response = await apiCamelback.post<LoginResponse>(
        "/api/v1/auth",
        credentials
      )
      const { token } = response.data

      await setStorageItemAsync(AUTH_TOKEN_KEY, token)
    } catch (error) {
      throw error
    }
  }, [])

  const signOut = React.useCallback(async () => {
    try {
      await setStorageItemAsync(AUTH_TOKEN_KEY, null)
      router.navigate("/sign-in")
      setUser(null)
    } catch (error) {
      throw error
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        signIn,
        signOut,
        isAuthenticated: !!token,
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
