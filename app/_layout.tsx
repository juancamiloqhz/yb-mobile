import "@/global.css"

import * as React from "react"
import { AppStateStatus, Platform } from "react-native"
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native"
import { PortalHost } from "@rn-primitives/portal"
import {
  focusManager,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"
import { useFonts } from "expo-font"
import { Slot } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { StatusBar } from "expo-status-bar"

import { setAndroidNavigationBar } from "@/lib/android-navigation-bar"
import { NAV_THEME } from "@/lib/constants"
import { AuthProvider } from "@/lib/context/auth"
import { useAppState } from "@/hooks/use-app-state"
import { useColorScheme } from "@/hooks/use-color-scheme"
import { useOnlineManager } from "@/hooks/use-online-manager"

// import { AuthGuard } from "@/components/guards/auth-guard"

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router"

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
}
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
}

function onAppStateChange(status: AppStateStatus) {
  // React Query already supports in web browser refetch on window focus by default
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active")
  }
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 2 } },
})

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const hasMounted = React.useRef(false)
  const { colorScheme, isDarkColorScheme } = useColorScheme()
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  })
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false)

  useOnlineManager()
  useAppState(onAppStateChange)

  useIsomorphicLayoutEffect(() => {
    if (error) throw error
  }, [error])

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current || !loaded) return

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

  return <RootLayoutNav isDarkColorScheme={isDarkColorScheme} />
}

function RootLayoutNav({ isDarkColorScheme }: { isDarkColorScheme: boolean }) {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
          <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
          <Slot />
          {/* <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            {!isColorSchemeLoaded || !loaded ? (
              <Stack.Screen name="loading" options={{ headerShown: false }} />
            ) : (
              <AuthGuard>
                <Stack.Screen
                  name="sign-in"
                  options={{
                    title: "Sign In",
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="(dashboard)"
                  options={{
                    headerShown: false,
                  }}
                />
              </AuthGuard>
            )}
            </Stack> */}
          <PortalHost />
        </ThemeProvider>
      </QueryClientProvider>
    </AuthProvider>
  )
}

const useIsomorphicLayoutEffect =
  Platform.OS === "web" && typeof window === "undefined"
    ? React.useEffect
    : React.useLayoutEffect
