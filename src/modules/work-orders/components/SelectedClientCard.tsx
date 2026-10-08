import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { UserCheck, X } from "lucide-react-native";
import { useTheme } from "@/theme";
import { MockClient } from "../mocks/clients.mock";

export interface SelectedClientCardProps {
  client: MockClient;
  onClear: () => void;
}

export const SelectedClientCard: React.FC<SelectedClientCardProps> = ({
  client,
  onClear,
}) => {
  const { colors, radius, typography } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surfaceInput,
          borderColor: colors.brandPrimary,
          borderRadius: radius.xl,
        },
      ]}
    >
      <View style={styles.left}>
        <View
          style={[
            styles.iconWrap,
            {
              backgroundColor: colors.surfaceAvatar,
              borderRadius: radius.full,
            },
          ]}
        >
          <UserCheck size={20} color={colors.brandPrimary} />
        </View>
        <View style={styles.info}>
          <Text style={[typography.titleCard, { color: colors.textStrong }]}>
            {client.name}
          </Text>
          <Text style={[typography.bodyMd, { color: colors.textSecondary }]}>
            {client.phone} · {client.clientType}
          </Text>
        </View>
      </View>

      <Pressable onPress={onClear} hitSlop={8} style={styles.clearBtn}>
        <X size={18} color={colors.textMuted} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1.5,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconWrap: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  info: {
    flex: 1,
    gap: 2,
  },
  clearBtn: {
    padding: 4,
  },
});

