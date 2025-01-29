import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import Animated, { Extrapolation, interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated'
import { Dimensions, LayoutChangeEvent, Pressable, TouchableOpacity, View } from 'react-native'
import { Mic } from '~/lib/icons/Mic'
import { Text } from '~/components/ui/text'
import * as React from 'react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useSharedValue } from 'react-native-reanimated'

const { height: screenHeight, width: screenWidth } = Dimensions.get('window')

type SessionSheetProps = {
  bottomTabBarHeight?: number
  animatedPosition?: SharedValue<number>
}

export default function SessionSheet({
  animatedPosition,
  bottomTabBarHeight = 83,
}: SessionSheetProps) {
  const [handleHeight, setHandleHeight] = useState(0)
  const [position, setPosition] = useState(0)

  animatedPosition = animatedPosition || useSharedValue(0)

  const sheetRef = useRef<BottomSheet>(null)

  const startPoint = bottomTabBarHeight + handleHeight

  const snapPoints = useMemo(() => [startPoint, 500, '100%'], [startPoint])

  const handleOnSheetViewLayout = (event: LayoutChangeEvent) => {
    setHandleHeight(event.nativeEvent.layout.height)
    console.log('Y', event.nativeEvent.layout.y)
    console.log('Height', event.nativeEvent.layout.height)
  }

  const handleHandlePress = useCallback(() => {
    if (position === 0) {
      sheetRef.current?.snapToIndex(1)
    } else if (position === 1) {
      //sheetRef.current?.snapToIndex(0)
    }
  }, [position])

  const animatedSheetContainerStyle = useAnimatedStyle(() => {
    const padding = interpolate(animatedPosition.value, [780, 432], [12, 0], Extrapolation.CLAMP)
    const width = interpolate(padding, [12, 0], [0, 2], Extrapolation.CLAMP)
    const marginLeft = interpolate(padding, [12, 0], [0, -1], Extrapolation.CLAMP)
    const height = interpolate(animatedPosition.value, [432, 0], [0, 2], Extrapolation.CLAMP)
    const marginTop = interpolate(animatedPosition.value, [432, 0], [0, -1], Extrapolation.CLAMP)
    return {
      height: padding === 12 ? 'auto' : padding === 0 ? screenHeight + height : '100%',
      width: screenWidth + width,
      marginTop: marginTop,
      marginLeft: marginLeft,
      padding: padding,
    }
  })

  const animatedSheetStyle = useAnimatedStyle(() => {
    const height = interpolate(animatedPosition.value, [780, 432], [0, 100], Extrapolation.CLAMP)
    return {
      height: height === 0 ? 'auto' : `${height}%`,
    }
  })

  return (
    <View style={{ height: screenHeight }} className={'absolute bottom-0 left-0 right-0'}>
      <BottomSheet
        ref={sheetRef}
        onChange={index => setPosition(index)}
        snapPoints={snapPoints}
        backgroundStyle={{ backgroundColor: 'transparent' }}
        containerHeight={screenHeight}
        animatedPosition={animatedPosition}
        enableDynamicSizing={false}
        handleComponent={null}>
        <BottomSheetView>
          <Animated.View onLayout={handleOnSheetViewLayout} style={animatedSheetContainerStyle}>
            <Animated.View
              style={[{ minHeight: 43 }, animatedSheetStyle]}
              className={'rounded-lg border-border bg-card border-[0.5px] w-full flex flex-row p-3'}>
              <Pressable onPress={handleHandlePress} className={'flex flex-row w-full'}>
                <View>
                  <Mic size={20} className={'text-foreground'} />
                </View>
                <Text>Hello</Text>
              </Pressable>
            </Animated.View>
          </Animated.View>
        </BottomSheetView>
      </BottomSheet>
    </View>
  )
}