import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated'
import { Dimensions, Pressable, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Input } from '~/components/ui/input'
import { useColorScheme } from '~/lib/useColorScheme'
import { Mic } from '~/lib/icons/Mic'
import { Text } from '~/components/ui/text'
import { Separator } from '~/components/ui/separator'
import * as React from 'react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useSession } from '~/hooks/useSessions'
import classnames from 'classnames'
import usePassageSuggestion from '~/hooks/usePassageSuggestion'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import SessionHeader from '~/components/SessionSheet/SessionHeader'

export const headerHeight = 64
export const handleHeight = 43
export const handlePadding = 12
const handleHeightAndPadding = handleHeight + handlePadding * 2

const { height: screenHeight, width: screenWidth } = Dimensions.get('window')

type SessionSheetProps = {
  bottomTabBarHeight?: number
  animatedPosition: SharedValue<number>
}

export default function SessionSheet({
  animatedPosition,
  bottomTabBarHeight = 83,
}: SessionSheetProps) {
  const [position, setPosition] = useState(0)

  const { data } = useSession()
  const suggestion = usePassageSuggestion()
  const { isDarkColorScheme } = useColorScheme()
  const insets = useSafeAreaInsets()

  const sheetRef = useRef<BottomSheet>(null)

  const startPoint = bottomTabBarHeight + handleHeightAndPadding

  const midPoint = 500

  const snapPoints = useMemo(() => [data ? suggestion?.show ?  startPoint + headerHeight : startPoint : 1, midPoint, screenHeight - insets.top], [startPoint, suggestion?.show, data])

  const handleHandlePress = useCallback(() => {
    if (position === 0) {
      sheetRef.current?.snapToIndex(1)
    } else if (position === 1) {
      //sheetRef.current?.snapToIndex(0)
    }
  }, [position])

  const animatedSheetContainerStyle = useAnimatedStyle(() => {
    const final = screenHeight - midPoint
    const start = screenHeight - startPoint
    const padding = interpolate(animatedPosition.value, [final, start-handleHeight-14, start], [0, handlePadding, handlePadding], Extrapolation.CLAMP)
    const width = interpolate(padding, [handlePadding, 0], [0, 2], Extrapolation.CLAMP)
    const marginLeft = interpolate(padding, [handlePadding, 0], [0, -1], Extrapolation.CLAMP)
    const marginTop = interpolate(animatedPosition.value, [final, 0], [0, -1], Extrapolation.CLAMP)
    return {
      width: screenWidth + width,
      marginTop: marginTop,
      marginLeft: marginLeft,
      padding: padding,
    }
  })

  const animatedSheetStyle = useAnimatedStyle(() => {
    const final = screenHeight - midPoint
    const start = screenHeight - startPoint
    const difference = start - final
    const height = interpolate(animatedPosition.value, [insets.top, final, start-handleHeight-14, start], [screenHeight - insets.top, difference + handleHeightAndPadding + 1, handleHeight * 2 + 14, handleHeight], Extrapolation.CLAMP)
    const radius = interpolate(animatedPosition.value, [start, final], [8, 1], Extrapolation.CLAMP)
    return {
      height: height,
      borderBottomRightRadius: radius,
      borderBottomLeftRadius: radius,
    }
  })

  const animatedInnerStyle = useAnimatedStyle(() => {
    const final = screenHeight - midPoint
    const paddingBottom = interpolate(animatedPosition.value, [insets.top, final], [insets.bottom, 0], Extrapolation.CLAMP)
    console.log('animated value', animatedPosition.value)
    console.log('paddingBottom', paddingBottom)
    return {
      paddingBottom
    }
  })

  return (
    <View style={{ height: screenHeight }} className={classnames('absolute bottom-0 left-0 right-0', data ? '' : 'hidden')}>
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
          <Animated.View className={'h-full overflow-hidden'} style={animatedSheetContainerStyle}>
            <Animated.View
              style={[{ minHeight: handleHeight }, animatedSheetStyle]}
              className={'overflow-hidden rounded-lg border-border bg-card border-[0.5px] p-[0.5px] w-full flex flex-row'}>
              <View className={'flex-1 flex-row w-full justify-between'}>
                <Animated.View style={[animatedInnerStyle]} className={'flex flex-col-reverse justify-between overflow-hidden'}>
                  <View className={'z-10 bg-background rounded-lg'} /*blurType={'dark'} blurAmount={position > 0 ? 90 : 0}*/ >
                    <Pressable onPress={handleHandlePress} className={classnames('flex flex-row justify-between w-full px-3 pb-3', position > 0 ? 'pt-3' : '')}>
                      <View className={'flex flex-row gap-2'}>
                        <View>
                          <Mic size={20} className={'text-foreground'} />
                        </View>
                        <Text>{suggestion?.context}</Text>
                      </View>
                      <TouchableOpacity className={'flex'}>
                        { /*<Square size={20} className={'text-foreground'}/> */}
                      </TouchableOpacity>
                    </Pressable>
                  </View>
                  <View className={'flex-1 px-3 gap-3'}>
                    <View className={'flex flex-row gap-3'}>
                      <Input className={'flex-1'} placeholder={'Sermon name'} />
                      <Input className={'flex-1'} placeholder={'Speaker name'} />
                    </View>
                    <ScrollView className={'flex-1'}>
                      <Text>{data?.transcript?.text?.current}</Text>
                    </ScrollView>
                  </View>
                  <SessionHeader />
                </Animated.View>
              </View>
            </Animated.View>
          </Animated.View>
        </BottomSheetView>
      </BottomSheet>
    </View>
  )
}