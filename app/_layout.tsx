import "@/global.css"

import * as React from "react"
import { Platform, View } from "react-native"
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native"
import { PortalHost } from "@rn-primitives/portal"
import { useFonts } from "expo-font"
import { Stack } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { StatusBar } from "expo-status-bar"

import { setAndroidNavigationBar } from "@/lib/android-navigation-bar"
import config from "@/lib/config"
import { NAV_THEME } from "@/lib/constants"
import { Bell } from "@/lib/icons/Bell"
import { UserCircle } from "@/lib/icons/UserCircle"
import { useColorScheme } from "@/lib/useColorScheme"
import { ThemeToggle } from "@/components/ThemeToggle"

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
}
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
}

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router"

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const hasMounted = React.useRef(false)
  const { colorScheme, isDarkColorScheme } = useColorScheme()
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  })
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false)

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current || !loaded) {
      return
    }

    if (Platform.OS === "web") {
      // Adds the background color to the html element to prevent white background on overscroll.
      document.documentElement.classList.add("bg-background")
    }
    setAndroidNavigationBar(colorScheme)
    setIsColorSchemeLoaded(true)
    hasMounted.current = true
    SplashScreen.hideAsync()
  }, [loaded])

  if (!isColorSchemeLoaded || !loaded) {
    return null
  }

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen
          name="index"
          options={{
            title: config.name,
            headerLeft: () => (
              <>
                <UserCircle
                  className="text-foreground"
                  size={23}
                  strokeWidth={1.25}
                />
              </>
            ),
            headerRight: () => (
              <View className="flex-row items-center gap-3">
                <Bell
                  className="text-foreground"
                  size={23}
                  strokeWidth={1.25}
                />
                <ThemeToggle />
              </View>
            ),
          }}
        />
      </Stack>
      <PortalHost />
    </ThemeProvider>
  )
}

const useIsomorphicLayoutEffect =
  Platform.OS === "web" && typeof window === "undefined"
    ? React.useEffect
    : React.useLayoutEffect
