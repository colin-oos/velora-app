import '~/global.css'

import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native'
import { BottomTabBar } from '@react-navigation/bottom-tabs'
import { Tabs } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import * as React from 'react'
import { Platform, View } from 'react-native'
import { NAV_THEME } from '~/lib/constants'
import { useColorScheme } from '~/lib/useColorScheme'
import { PortalHost } from '@rn-primitives/portal'
import { ThemeToggle } from '~/components/ThemeToggle'
import { setAndroidNavigationBar } from '~/lib/android-navigation-bar'
import { Card } from '~/components/ui/card'
import { Text } from '~/components/ui/text'
import { Mic } from '~/lib/icons/Mic'
import TabBar from '~/components/TabBar'

// todo we may want to use this for animating a wave form https://github.com/VinamraVij/react-native-audio-wave-recording/blob/main/App.tsx

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
} from 'expo-router'

export default function RootLayout() {
  const hasMounted = React.useRef(false)
  const { colorScheme, isDarkColorScheme } = useColorScheme()
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false)

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) {
      return
    }

    if (Platform.OS === 'web') {
      // Adds the background color to the html element to prevent white background on overscroll.
      document.documentElement.classList.add('bg-background')
    }
    setAndroidNavigationBar(colorScheme)
    setIsColorSchemeLoaded(true)
    hasMounted.current = true
  }, [])

  if (!isColorSchemeLoaded) {
    return null
  }

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
      <Tabs
        screenOptions={{
          headerRight: () => <ThemeToggle />,
        }}
        tabBar={props => <TabBar {...props} />}>
        <Tabs.Screen
          name={'index'}
          options={{
            tabBarItemStyle: { display: 'none' }
          }}
        />
        <Tabs.Screen
          name="sermon/index"
          options={{
            title: 'Sermons',
          }}
        />
        <Tabs.Screen
          name={'other'}
          options={{
            title: 'Other',
          }}
        />
      </Tabs>
      <PortalHost />
    </ThemeProvider>
  )
}

const useIsomorphicLayoutEffect =
  Platform.OS === 'web' && typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect
