import React from "react"
import { View } from "react-native"
import { Link, Redirect, Stack } from "expo-router"

import config from "@/lib/config"
import { useAuth } from "@/lib/context/auth"
import { Bell } from "@/lib/icons/Bell"
import { LogOut } from "@/lib/icons/LogOut"
import { UserCircle } from "@/lib/icons/UserCircle"
import { useUserStore } from "@/lib/store/user"
import { useColorScheme } from "@/hooks/use-color-scheme"
import { Button } from "@/components/ui/button"
import ThemeToggle from "@/components/theme-toggle"

export default function AppLayout() {
  const { isDarkColorScheme } = useColorScheme()
  const { isLoading, isAuthenticated, signOut } = useAuth()

  const { fetchUser, user } = useUserStore()

  React.useEffect(() => {
    if (isAuthenticated) {
      fetchUser()
    }
  }, [isAuthenticated])

  if (isLoading) return null

  if (!isAuthenticated) {
    return <Redirect href="/sign-in" />
  }

  if (!user) {
    return (
      <Stack>
        <Stack.Screen name="loading" options={{ headerShown: false }} />
      </Stack>
    )
  }

  return (
    <Stack
      screenOptions={{
        headerBackButtonDisplayMode: "minimal",
        headerStyle: {
          backgroundColor: isDarkColorScheme ? "#000000" : "#ffcd00",
        },
        headerTintColor: isDarkColorScheme ? "#ffcd00" : "#000000",
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* <Stack.Screen name="+not-found" /> */}
      <Stack.Screen
        name="index"
        options={{
          title: config.name,
          headerLeft: () => (
            <Link href="/profile">
              <UserCircle
                className="text-foreground"
                size={23}
                strokeWidth={1.25}
              />
            </Link>
          ),
          headerRight: () => (
            <View className="flex-row items-center gap-3">
              <Link href="/notifications">
                <Bell
                  className="text-foreground"
                  size={23}
                  strokeWidth={1.25}
                />
              </Link>
              <ThemeToggle />
              <Button
                onPress={signOut}
                variant="ghost"
                size="icon"
                className="m-0 w-auto p-0"
              >
                <LogOut size={23} strokeWidth={1.25} />
              </Button>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="movies"
        options={{
          title: "Movies",
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          title: "Notifications",
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
    </Stack>
  )
}
