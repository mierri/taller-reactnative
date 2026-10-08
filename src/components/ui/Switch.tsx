import { useTheme } from '@/theme';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  Switch as RNSwitch,
  View,
  ViewStyle,
} from 'react-native';

export interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  trackColor?: {
    false?: string;
    true?: string;
  };
  thumbColor?: string;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

const TRACK_WIDTH = 48;
const TRACK_HEIGHT = 28;
const THUMB_SIZE = 22;
const TRACK_PADDING = 3;
const TRANSLATE_X = TRACK_WIDTH - THUMB_SIZE - TRACK_PADDING * 2;

const IosSwitch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  disabled = false,
  trackColor,
  thumbColor = '#ffffff',
  style,
  accessibilityLabel,
}) => {
  const { colors } = useTheme();
  const offColor = trackColor?.false ?? colors.borderGrabber;
  const onColor = trackColor?.true ?? colors.brandPrimary;

  return (
    <RNSwitch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      trackColor={{
        false: offColor,
        true: onColor,
      }}
      thumbColor={thumbColor}
      ios_backgroundColor={offColor}
      style={style}
      accessibilityLabel={accessibilityLabel}
    />
  );
};

const AndroidSwitch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  disabled = false,
  trackColor,
  thumbColor = '#ffffff',
  style,
  accessibilityLabel,
}) => {
  const { colors } = useTheme();
  const [animatedValue] = useState(
    () => new Animated.Value(value ? TRANSLATE_X : 0),
  );

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? TRANSLATE_X : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [value, animatedValue]);

  const offColor = trackColor?.false ?? colors.borderGrabber;
  const onColor = trackColor?.true ?? colors.brandPrimary;

  const activeOpacity = animatedValue.interpolate({
    inputRange: [0, TRANSLATE_X],
    outputRange: [0, 1],
  });

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      onPress={() => onValueChange(!value)}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={[styles.container, disabled && styles.disabled, style]}
    >
      <View style={[styles.track, { backgroundColor: offColor }]}>
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            styles.activeTrack,
            {
              backgroundColor: onColor,
              opacity: activeOpacity,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.thumb,
            {
              backgroundColor: thumbColor,
              transform: [{ translateX: animatedValue }],
            },
          ]}
        />
      </View>
    </Pressable>
  );
};

export const Switch: React.FC<SwitchProps> = (props) => {
  if (Platform.OS === 'ios') {
    return <IosSwitch {...props} />;
  }
  return <AndroidSwitch {...props} />;
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    padding: TRACK_PADDING,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  activeTrack: {
    borderRadius: TRACK_HEIGHT / 2,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  disabled: {
    opacity: 0.5,
  },
});
