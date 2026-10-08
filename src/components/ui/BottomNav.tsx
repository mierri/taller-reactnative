import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { usePathname } from "expo-router";
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
  const { colors, typography, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  if (
    pathname &&
    (pathname.includes("/new") ||
      pathname.includes("step-two") ||
      pathname.includes("step-three"))
  ) {
    return null;
  }

  const bottomPadding = Math.max(insets.bottom, 8);

  return (
    <View
      style={[
        styles.navContainer,
        {
          backgroundColor: colors.surfaceNav,
          borderTopColor: colors.borderInput,
          paddingBottom: bottomPadding,
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

          const activeColor = colors.brandPrimaryText;
          const inactiveColor = colors.textMuted;
          const itemColor = isFocused ? activeColor : inactiveColor;

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              onLongPress={onLongPress}
              style={[styles.navItem, { borderRadius: radius.md }]}
              activeOpacity={0.7}
            >
              <IconComponent size={24} color={itemColor} />

              <Text
                style={[typography.captionMedium, { color: itemColor }]}
                numberOfLines={1}
              >
                {config.label}
              </Text>

              {isFocused && (
                <View
                  style={[
                    styles.activeDot,
                    {
                      backgroundColor: activeColor,
                      borderRadius: radius.full,
                    },
                  ]}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    paddingTop: 8,
    paddingHorizontal: 12,
    borderTopWidth: 1,
  },
  itemsRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 56,
  },
  navItem: {
    flex: 1,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    position: "relative",
  },
  activeDot: {
    position: "absolute",
    bottom: 2,
    width: 4,
    height: 4,
  },
});
