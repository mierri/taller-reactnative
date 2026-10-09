import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FileText, Wallet, Wrench } from "lucide-react-native";
import { useTheme } from "@/theme";
import { OrderDetailTabKey } from "../../types/work-order-detail.types";

export interface DetailTabNavigationProps {
  activeTab: OrderDetailTabKey;
  onTabChange: (tab: OrderDetailTabKey) => void;
}

export const DetailTabNavigation: React.FC<DetailTabNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  const { colors, typography, radius, shadows } = useTheme();

  const tabs: {
    key: OrderDetailTabKey;
    label: string;
    icon: (color: string) => React.ReactNode;
  }[] = [
    {
      key: "bahia",
      label: "Bahía",
      icon: (color) => <Wrench size={16} color={color} strokeWidth={2} />,
    },
    {
      key: "cotizacion",
      label: "Cotización",
      icon: (color) => <FileText size={16} color={color} strokeWidth={2} />,
    },
    {
      key: "cierre",
      label: "Cierre",
      icon: (color) => <Wallet size={16} color={color} strokeWidth={2} />,
    },
  ];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceTile,
          borderRadius: radius.xl,
        },
      ]}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        const tintColor = isActive ? colors.brandPrimary : colors.textSecondary;

        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => onTabChange(tab.key)}
            activeOpacity={0.8}
            style={[
              styles.tabItem,
              isActive && [
                styles.activeTabItem,
                {
                  backgroundColor: colors.surfaceInput,
                  borderRadius: radius.lg,
                },
                shadows.card,
              ],
            ]}
          >
            {tab.icon(tintColor)}
            <Text
              style={[
                typography.captionMedium,
                styles.tabLabel,
                {
                  color: tintColor,
                  fontWeight: isActive ? "600" : "500",
                },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 4,
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12,
  },
  tabItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    gap: 6,
  },
  activeTabItem: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  tabLabel: {
    fontSize: 13,
  },
});
