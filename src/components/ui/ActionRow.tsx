import React from 'react';
import {
  Pressable,
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/theme';

export interface ActionRowProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showChevron?: boolean;
  showDivider?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const ActionRow: React.FC<ActionRowProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  showChevron = true,
  showDivider = true,
  style,
}) => {
  const { colors, radius, typography } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.container,
        {
          borderBottomColor: colors.borderDivider,
          borderBottomWidth: showDivider ? 1 : 0,
          opacity: pressed ? 0.75 : 1,
        },
        style,
      ]}
    >
      {icon && (
        <View
          style={[
            styles.tile,
            {
              backgroundColor: colors.surfaceTile,
              borderRadius: radius.md,
            },
          ]}
        >
          {icon}
        </View>
      )}

      <View style={styles.textContainer}>
        <Text style={[typography.labelMd, { color: colors.textStrong }]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[typography.caption, { color: colors.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>

      {showChevron && (
        <ChevronRight size={20} color={colors.textMuted} />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
    width: '100%',
  },
  tile: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
});
