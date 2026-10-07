import React from 'react';
import {
  Pressable,
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@/theme';
import { ChevronRight } from 'lucide-react-native';

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
  const { colors, radii, spacing } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.container,
        {
          paddingHorizontal: spacing[4], // px 16
          borderBottomColor: colors.borderDivider,
          borderBottomWidth: showDivider ? 1.2 : 0, // divisor 1.2
          opacity: pressed ? 0.75 : 1,
        },
        style,
      ]}
    >
      {/* Tile 40x40 radio 12 fill tile */}
      {icon && (
        <View
          style={[
            styles.tile,
            {
              backgroundColor: colors.surfaceTile,
              borderRadius: radii.md, // radio 12
              marginRight: spacing[3],
            },
          ]}
        >
          {icon}
        </View>
      )}

      {/* Textos */}
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: colors.textStrong }]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>

      {/* Chevron 16 */}
      {showChevron && (
        <ChevronRight size={16} color={colors.textSecondary} />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 72, // h 72
    flexDirection: 'row',
    alignItems: 'center',
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
    justifyContent: 'center',
  },
  title: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500', // 12/16 500
  },
  subtitle: {
    fontSize: 10,
    lineHeight: 15, // 10/15
    marginTop: 2,
  },
});

