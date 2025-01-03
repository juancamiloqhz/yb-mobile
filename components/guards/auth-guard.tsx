import React from "react"
import { Redirect, useSegments } from "expo-router"

import { useAuth } from "@/lib/context/auth"

const publicRoutes = ["/sign-in", "/register", "/forgot-password"]

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const segments = useSegments()

  const isPublicRoute = React.useMemo(
    () => publicRoutes.includes(`/${segments[0]}`),
    [segments[0]]
  )

  if (isLoading) {
    return null // or a loading screen
  }

  if (isAuthenticated && isPublicRoute) {
    return <Redirect href="/" />
  }

  if (!isAuthenticated && !isPublicRoute) {
    return <Redirect href="/sign-in" />
  }

  return <>{children}</>
}
