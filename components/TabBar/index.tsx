import { BottomTabBar, BottomTabBarProps, useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import {
  View,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  LayoutChangeEvent,
  TextLayoutEventData,
  Pressable,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import BottomSheet, { BottomSheetFlatList, BottomSheetView } from '@gorhom/bottom-sheet'
import { Button } from '~/components/ui/button'
import { Text } from '~/components/ui/text'
import { Mic } from '~/lib/icons/Mic'
import { Card } from '~/components/ui/card'
import * as React from 'react'
import Animated, {
  useSharedValue,
  useDerivedValue,
  useAnimatedStyle,
  clamp,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated'
import SessionSheet from '~/components/SessionSheet'
import ActionFab from '~/components/ActionFab'

const { height: screenHeight, width: screenWidth } = Dimensions.get('window')

export default function TabBar(props: BottomTabBarProps) {
  const [bottomTabBarHeight, setBottomTabBarHeight] = useState(83)
  const [handleHeight, setHandleHeight] = useState(0)
  const [position, setPosition] = useState(0)

  const translateY = useSharedValue(0)
  // hooks
  const sheetRef = useRef<BottomSheet>(null)

  // variables
  const data = useMemo(
    () =>
      Array(50)
        .fill(0)
        .map((_, index) => `index-${index}`),
    [],
  )

  const startPoint = bottomTabBarHeight + handleHeight

  const snapPoints = useMemo(() => [startPoint, 500, '100%'], [startPoint])

  const handleHandlePress = useCallback(() => {
    if (position === 0) {
      sheetRef.current?.snapToIndex(1)
    } else if (position === 1) {
      //sheetRef.current?.snapToIndex(0)
    }
  }, [position])

  useEffect(() => {
    //sheetRef.current?.snapToIndex(0)
  }, [])

  // render
  const renderItem = useCallback(
    ({ item }: { item: string }) => (
      <View style={styles.itemContainer}>
        <Text>{item}</Text>
      </View>
    ),
    [],
  )

  useDerivedValue(() => {
    //console.log('translateY', translateY.value)
  }, [translateY])

  const animatedTabBarStyle = useAnimatedStyle(() => {
    const translate = clamp(translateY.value, 0, 432)
    const translate2 = interpolate(translate, [0, 432], [bottomTabBarHeight, 0])
    return {
      transform: [{ translateY: translate2 }],
    }
  })

  const animatedSheetContainerStyle = useAnimatedStyle(() => {
    const padding = interpolate(translateY.value, [780, 432], [12, 0], Extrapolation.CLAMP)
    const width = interpolate(padding, [12, 0], [0, 2], Extrapolation.CLAMP)
    const marginLeft = interpolate(padding, [12, 0], [0, -1], Extrapolation.CLAMP)
    const height = interpolate(translateY.value, [432, 0], [0, 2], Extrapolation.CLAMP)
    const marginTop = interpolate(translateY.value, [432, 0], [0, -1], Extrapolation.CLAMP)
    return {
      height: padding === 12 ? 'auto' : padding === 0 ? screenHeight + height : '100%',
      width: screenWidth + width,
      marginTop: marginTop,
      marginLeft: marginLeft,
      padding: padding,
    }
  })

  const animatedSheetStyle = useAnimatedStyle(() => {
    const height = interpolate(translateY.value, [780, 432], [0, 100], Extrapolation.CLAMP)
    return {
      height: height === 0 ? 'auto' : `${height}%`,
    }
  })

  const handleBottomTabBarLayout = (event: LayoutChangeEvent) => {
    console.log('handleBottomTabBarLayout', event.nativeEvent.layout.height)
    setBottomTabBarHeight(event.nativeEvent.layout.height)
  }

  const handleHandleLayout = (event: LayoutChangeEvent) => {
    console.log('handleHandleLayout', event.nativeEvent.layout.height)
    setHandleHeight(event.nativeEvent.layout.height)
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
