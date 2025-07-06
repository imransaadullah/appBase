import React from 'react';
import { ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  Extrapolate,
} from 'react-native-reanimated';
import { PanGestureHandler, TapGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import LottieView from 'lottie-react-native';

interface AnimatedFadeProps {
  children: React.ReactNode;
  visible: boolean;
  duration?: number;
  style?: ViewStyle;
}

export const AnimatedFade: React.FC<AnimatedFadeProps> = ({
  children,
  visible,
  duration = 300,
  style,
}) => {
  const opacity = useSharedValue(visible ? 1 : 0);

  React.useEffect(() => {
    opacity.value = withTiming(visible ? 1 : 0, { duration });
  }, [visible, duration, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

interface AnimatedScaleProps {
  children: React.ReactNode;
  scale?: number;
  duration?: number;
  style?: ViewStyle;
  onPress?: () => void;
}

export const AnimatedScale: React.FC<AnimatedScaleProps> = ({
  children,
  scale = 0.95,
  duration = 150,
  style,
  onPress,
}) => {
  const scaleValue = useSharedValue(1);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: () => {
      scaleValue.value = withTiming(scale, { duration });
    },
    onEnd: () => {
      scaleValue.value = withTiming(1, { duration });
      if (onPress) {
        runOnJS(onPress)();
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  return (
    <TapGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[style, animatedStyle]}>
        {children}
      </Animated.View>
    </TapGestureHandler>
  );
};

interface AnimatedSlideProps {
  children: React.ReactNode;
  visible: boolean;
  direction?: 'left' | 'right' | 'up' | 'down';
  distance?: number;
  duration?: number;
  style?: ViewStyle;
}

export const AnimatedSlide: React.FC<AnimatedSlideProps> = ({
  children,
  visible,
  direction = 'right',
  distance = 100,
  duration = 300,
  style,
}) => {
  const translateX = useSharedValue(direction === 'left' ? -distance : direction === 'right' ? distance : 0);
  const translateY = useSharedValue(direction === 'up' ? -distance : direction === 'down' ? distance : 0);

  React.useEffect(() => {
    translateX.value = withTiming(visible ? 0 : (direction === 'left' ? -distance : direction === 'right' ? distance : 0), { duration });
    translateY.value = withTiming(visible ? 0 : (direction === 'up' ? -distance : direction === 'down' ? distance : 0), { duration });
  }, [visible, direction, distance, duration, translateX, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <Animated.View style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

interface AnimatedPulseProps {
  children: React.ReactNode;
  scale?: number;
  duration?: number;
  style?: ViewStyle;
}

export const AnimatedPulse: React.FC<AnimatedPulseProps> = ({
  children,
  scale = 1.1,
  duration = 1000,
  style,
}) => {
  const scaleValue = useSharedValue(1);

  React.useEffect(() => {
    scaleValue.value = withRepeat(
      withSequence(
        withTiming(scale, { duration: duration / 2 }),
        withTiming(1, { duration: duration / 2 })
      ),
      -1,
      true
    );
  }, [scale, duration, scaleValue]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  return (
    <Animated.View style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

interface DraggableProps {
  children: React.ReactNode;
  onDragEnd?: (x: number, y: number) => void;
  style?: ViewStyle;
}

export const Draggable: React.FC<DraggableProps> = ({
  children,
  onDragEnd,
  style,
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_: any, context: { startX: number; startY: number }) => {
      context.startX = translateX.value;
      context.startY = translateY.value;
    },
    onActive: (event: any, context: { startX: number; startY: number }) => {
      translateX.value = context.startX + event.translationX;
      translateY.value = context.startY + event.translationY;
    },
    onEnd: () => {
      if (onDragEnd) {
        runOnJS(onDragEnd)(translateX.value, translateY.value);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[style, animatedStyle]}>
        {children}
      </Animated.View>
    </PanGestureHandler>
  );
};

interface AnimatedProgressProps {
  progress: number;
  height?: number;
  backgroundColor?: string;
  progressColor?: string;
  style?: ViewStyle;
}

export const AnimatedProgress: React.FC<AnimatedProgressProps> = ({
  progress,
  height = 4,
  backgroundColor = '#e0e0e0',
  progressColor = '#007AFF',
  style,
}) => {
  const width = useSharedValue(0);

  React.useEffect(() => {
    width.value = withTiming(progress, { duration: 300 });
  }, [progress, width]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value * 100}%`,
  }));

  return (
    <Animated.View
      style={[
        {
          height,
          backgroundColor,
          borderRadius: height / 2,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          {
            height: '100%',
            backgroundColor: progressColor,
            borderRadius: height / 2,
          },
          animatedStyle,
        ]}
      />
    </Animated.View>
  );
};

interface LottieAnimationProps {
  source: any;
  autoPlay?: boolean;
  loop?: boolean;
  style?: ViewStyle;
  onAnimationFinish?: () => void;
}

export const LottieAnimation: React.FC<LottieAnimationProps> = ({
  source,
  autoPlay = true,
  loop = true,
  style,
  onAnimationFinish,
}) => {
  return (
    <LottieView
      source={source}
      autoPlay={autoPlay}
      loop={loop}
      style={style}
      onAnimationFinish={onAnimationFinish}
    />
  );
};

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  style?: ViewStyle;
  textStyle?: any;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1000,
  style,
  textStyle,
}) => {
  const animatedValue = useSharedValue(0);

  React.useEffect(() => {
    animatedValue.value = withTiming(value, { duration });
  }, [value, duration, animatedValue]);

  const animatedStyle = useAnimatedStyle(() => {
    const displayValue = Math.floor(animatedValue.value);
    return {
      // Note: In a real implementation, you'd need to use a text component
      // that supports animated values, or use a different approach
    };
  });

  return (
    <Animated.View style={[style, animatedStyle]}>
      <Animated.Text style={textStyle}>
        {/* This would need proper implementation with animated text */}
        {value}
      </Animated.Text>
    </Animated.View>
  );
}; 