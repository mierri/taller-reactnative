import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/theme";
import {
  ClipboardList,
  Wallet,
  TrendingUp,
  Package,
  Ellipsis,
  CarFront,
  ReceiptText,
} from "lucide-react-native";

export interface CustomBottomNavProps {
  state: any;
  descriptors: any;
  navigation: any;
  insets?: any;
}

const TAB_CONFIG: Record<
  string,
  { label: string; icon: React.ComponentType<{ size: number; color: string }> }
> = {
  orders: { label: "Órdenes", icon: ClipboardList },
  index: { label: "Órdenes", icon: ClipboardList },
  cash: { label: "Caja", icon: Wallet },
  finance: { label: "Finanzas", icon: TrendingUp },
  inventory: { label: "Inventario", icon: Package },
  more: { label: "Más", icon: Ellipsis },
  bay: { label: "Bahía", icon: ClipboardList },
  reception: { label: "Recepción", icon: CarFront },
  invoices: { label: "Facturas", icon: ReceiptText },
};

export const CustomBottomNav: React.FC<CustomBottomNavProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 16);

  const bg = isDark ? "rgba(22, 33, 27, 0.95)" : "rgba(244, 246, 239, 0.95)";

  const borderTopColor = isDark
    ? "rgba(255, 255, 255, 0.1)"
    : "rgba(255, 255, 255, 0.6)";

  return (
    <View
      style={[
        styles.navContainer,
        {
          backgroundColor: bg,
          borderTopColor,
          paddingBottom: bottomPadding,
          minHeight: 73 + (insets.bottom > 0 ? insets.bottom - 4 : 8),
        },
      ]}
    >
      <View style={styles.itemsRow}>
        {state.routes.map((route: any, index: number) => {
          const descriptor = descriptors[route.key];
          const options = descriptor?.options ?? {};

          if (
            options.tabBarItemStyle &&
            options.tabBarItemStyle.display === "none"
          ) {
            return null;
          }

          const isFocused = state.index === index;
          const config = TAB_CONFIG[route.name] ?? {
            label: options.title ?? route.name,
            icon: ClipboardList,
          };
          const IconComponent = config.icon;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          const iconColor = isFocused ? colors.brandPrimary : colors.textMuted;
          const textColor = isFocused ? colors.brandPrimary : colors.textMuted;

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.navItem}
              activeOpacity={0.7}
            >
              <View style={styles.iconWrapper}>
                <IconComponent size={21} color={iconColor} />
              </View>

              <Text
                style={[
                  styles.label,
                  {
                    color: textColor,
                    fontWeight: isFocused ? "600" : "500",
                  },
                ]}
                numberOfLines={1}
              >
                {config.label}
              </Text>

              <View style={styles.dotContainer}>
                {isFocused && (
                  <View
                    style={[
                      styles.activeDot,
                      { backgroundColor: colors.brandPrimary },
                    ]}
                  />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    paddingTop: 10,
    paddingHorizontal: 12,
    borderTopWidth: 1.2,
    justifyContent: "center",
    alignItems: "center",
  },
  itemsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  navItem: {
    width: 75,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapper: {
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 10,
    lineHeight: 15,
    marginTop: 2,
    textAlign: "center",
  },
  dotContainer: {
    height: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
