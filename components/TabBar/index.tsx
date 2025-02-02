import { BottomTabBar, BottomTabBarProps } from '@react-navigation/bottom-tabs'
import {
  View,
  StyleSheet,
  LayoutChangeEvent,
} from 'react-native'
import { useState } from 'react'
import * as React from 'react'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  clamp,
  interpolate,
} from 'react-native-reanimated'
import SessionSheet from '~/components/SessionSheet'
import ActionFab from '~/components/ActionFab'
import { useSession } from '~/hooks/useSessions'

export default function TabBar(props: BottomTabBarProps) {
  const [bottomTabBarHeight, setBottomTabBarHeight] = useState(83)

  const { data: activeSession } = useSession()

  const translateY = useSharedValue(0)

  const animatedTabBarStyle = useAnimatedStyle(() => {
    console.log('translateY', translateY.value)
    const translate = activeSession ? interpolate(clamp(translateY.value, 0, 432), [0, 432], [bottomTabBarHeight, 0]) : 0
    return {
      transform: [{ translateY: translate }],
    }
  }, [activeSession])

  const handleBottomTabBarLayout = (event: LayoutChangeEvent) => {
    console.log('handleBottomTabBarLayout', event.nativeEvent.layout.height)
    setBottomTabBarHeight(event.nativeEvent.layout.height)
  }

  return (
    <View>
      <ActionFab />
      <SessionSheet animatedPosition={translateY} bottomTabBarHeight={bottomTabBarHeight} />
      <Animated.View style={animatedTabBarStyle} onLayout={handleBottomTabBarLayout}>
        <BottomTabBar {...props} />
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: 'white',
  },
  itemContainer: {
    padding: 6,
    margin: 6,
    backgroundColor: '#eee',
  },
})
