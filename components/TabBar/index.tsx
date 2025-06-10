// components/TabBar/index.tsx
import { BottomTabBar, BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { View, LayoutChangeEvent } from 'react-native'
import React, { useState } from 'react'
import Animated, { useSharedValue, useAnimatedStyle, interpolate, clamp } from 'react-native-reanimated'
import SessionSheet from '~/components/SessionSheet'
import ActionFab from '~/components/ActionFab'
import { useSession } from '~/hooks/useSessions'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function TabBar(props: BottomTabBarProps) {
  const [bottomTabBarHeight, setBottomTabBarHeight] = useState(83)
  const { data: activeSession } = useSession()
  const translateY = useSharedValue(0)
  const insets = useSafeAreaInsets()

  const animatedTabBarStyle = useAnimatedStyle(() => {
    const translate = activeSession
      ? interpolate(clamp(translateY.value, 0, 432), [insets.top, 432], [bottomTabBarHeight, 0])
      : 0
    return { transform: [{ translateY: translate }] }
  }, [activeSession, bottomTabBarHeight])

  const handleBottomTabBarLayout = (event: LayoutChangeEvent) => {
    setBottomTabBarHeight(event.nativeEvent.layout.height)
  }

  return (
    <View>
      {/* Pass animatedPosition and bottomTabBarHeight to ActionFab */}
      <ActionFab bottomTabBarHeight={bottomTabBarHeight} animatedPosition={translateY} />
      <SessionSheet animatedPosition={translateY} bottomTabBarHeight={bottomTabBarHeight} />
      <Animated.View style={animatedTabBarStyle} onLayout={handleBottomTabBarLayout}>
        <BottomTabBar {...props} />
      </Animated.View>
    </View>
  )
}