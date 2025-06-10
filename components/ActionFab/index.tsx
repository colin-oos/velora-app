// components/ActionFab/index.tsx
import { TouchableOpacity } from 'react-native'
import React from 'react'
import { Mic } from '~/lib/icons/Mic'
import { useSession } from '~/hooks/useSessions'
import Animated, { useAnimatedStyle, interpolate, Extrapolation } from 'react-native-reanimated'
import { handleHeight, handlePadding } from '~/components/SessionSheet'

type ActionFabProps = {
  bottomTabBarHeight?: number;
  animatedPosition?: Animated.SharedValue<number>;
}

const fabPadding = 12

export default function ActionFab({
  bottomTabBarHeight = 83,
  animatedPosition,
}: ActionFabProps) {
  const session = useSession();

  const animatedFabStyle = useAnimatedStyle(() => {
    // When there is no active session, fix the FAB 12px above the TabBar.
    if (!session.data || !animatedPosition) {
      return {
        paddingBottom: bottomTabBarHeight + fabPadding,
      };
    }

    console.log('animatedPosition', animatedPosition.value);

    // Define the desired positions:
    // At index 0 (animatedPosition.value ≈ 782) we want:
    const fabBottomClosed = bottomTabBarHeight + handleHeight + handlePadding + fabPadding // e.g. 83+67 = 150
    // At index 1 (animatedPosition.value ≈ 432) we want the FAB to have risen,
    // so that its bottom is 12px above the SessionSheet’s top.
    // Based on your measurements, we assume that value should be about 336.
    const fabBottomIndex1 = fabBottomClosed + 350 + fabPadding

    // Interpolate the animated value from 782 (index 0) to 432 (index 1)
    // mapping to [fabBottomClosed, fabBottomIndex1].
    const fabBottom = interpolate(
      animatedPosition.value,
      [432, 782, 782 + 67 - fabPadding],
      [fabBottomIndex1, fabBottomClosed, bottomTabBarHeight + fabPadding],
      Extrapolation.CLAMP,
    );

    return {
      paddingBottom: fabBottom,
    };
  }, [session.data, bottomTabBarHeight, animatedPosition?.value]);

  const handleOnPress = async () => {
    await session.start();
  };

  return (
    <Animated.View style={animatedFabStyle} className="px-4 absolute transition-all duration-300 ease-in-out bottom-0 left-0 right-0 flex-row-reverse flex-1 gap-5">
      <TouchableOpacity onPress={handleOnPress} className="bg-foreground p-3.5 rounded-full">
        <Mic size={24} className="text-background" />
      </TouchableOpacity>
    </Animated.View>
  );
}