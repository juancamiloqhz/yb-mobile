import React from "react"
import { View } from "react-native"
import { Link, Stack } from "expo-router"

import config from "@/lib/config"
import { Bell } from "@/lib/icons/Bell"
import { UserCircle } from "@/lib/icons/UserCircle"
import { useUserStore } from "@/lib/store/user"
import { useColorScheme } from "@/lib/useColorScheme"
import { ThemeToggle } from "@/components/ThemeToggle"

export default function DashboardLayoutRoute() {
  const { isDarkColorScheme } = useColorScheme()
  const { fetchUser } = useUserStore()

  React.useEffect(() => {
    fetchUser()
  }, [])

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
