import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { User } from "lucide-react-native";
import { useTheme } from "@/theme";
import { MockClient } from "../mocks/clients.mock";

export interface ClientSearchDropdownProps {
  results: MockClient[];
  onSelect: (client: MockClient) => void;
  visible: boolean;
}

export const ClientSearchDropdown: React.FC<ClientSearchDropdownProps> = ({
  results,
  onSelect,
  visible,
}) => {
  const { colors, radius, typography } = useTheme();

  if (!visible || results.length === 0) return null;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceInput,
          borderColor: colors.borderInput,
          borderRadius: radius.xl,
        },
      ]}
    >
      {results.slice(0, 5).map((client, index) => {
        const isLast = index === results.length - 1;
        const vehicleInfo = [client.primaryVehicle, client.plate]
          .filter(Boolean)
          .join(" · ");

        return (
          <Pressable
            key={client.id}
            onPress={() => onSelect(client)}
            style={({ pressed }) => [
              styles.item,
              !isLast && {
                borderBottomColor: colors.borderDivider,
                borderBottomWidth: 1,
              },
              {
                backgroundColor: pressed
                  ? colors.surfaceTile
                  : "transparent",
              },
            ]}
          >
            <View
              style={[
                styles.iconWrap,
                {
                  backgroundColor: colors.surfaceAvatar,
                  borderRadius: radius.full,
                },
              ]}
            >
              <User size={16} color={colors.accentAvatarText} />
            </View>

            <View style={styles.textWrap}>
              <Text
                style={[typography.labelLg, { color: colors.textStrong }]}
                numberOfLines={1}
              >
                {client.name}
              </Text>
              {vehicleInfo.length > 0 && (
                <Text
                  style={[typography.caption, { color: colors.textMuted }]}
                  numberOfLines={1}
                >
                  {vehicleInfo}
                </Text>
              )}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    overflow: "hidden",
    marginTop: -8,
    marginBottom: 8,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  iconWrap: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  textWrap: {
    flex: 1,
    gap: 2,
  },
});

