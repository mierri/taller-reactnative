import React from "react";
import { View, Text, StyleSheet, ViewStyle, TouchableOpacity } from "react-native";
import { ClipboardList } from "lucide-react-native";
import { useTheme } from "@/theme";
import { Button, ButtonType } from "./Button";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  actionLabel?: string;
  actionButtonType?: ButtonType | "PillCard";
  onActionPress?: () => void;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title = "Tu primer vehículo empieza aquí",
  description = "Toca Recibir auto para registrar al cliente y comenzar el diagnóstico.",
  actionLabel,
  actionButtonType = "PillCard",
  onActionPress,
  style,
}) => {
  const { colors, typography, radius } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceTile,
          borderColor: colors.borderDashed,
          borderRadius: radius.xl,
        },
        style,
      ]}
    >
      <View style={styles.iconContainer}>
        {icon ?? <ClipboardList size={32} color={colors.textMuted} strokeWidth={1.8} />}
      </View>

      <Text
        style={[
          typography.titleCard,
          styles.title,
          { color: colors.textStrong },
        ]}
      >
        {title}
      </Text>

      <Text
        style={[
          typography.bodyMd,
          styles.description,
          { color: colors.textSecondary },
        ]}
      >
        {description}
      </Text>

      {actionLabel && onActionPress && (
        <View style={styles.actionContainer}>
          {actionButtonType === "PillCard" ? (
            <TouchableOpacity
              onPress={onActionPress}
              activeOpacity={0.8}
              style={[
                styles.pillButton,
                {
                  backgroundColor: colors.surfaceCard,
                  borderColor: colors.borderCard,
                  borderRadius: radius.full,
                },
              ]}
            >
              <Text
                style={[
                  typography.buttonMd,
                  { color: colors.brandPrimary },
                ]}
              >
                {actionLabel}
              </Text>
            </TouchableOpacity>
          ) : (
            <Button
              label={actionLabel}
              onPress={onActionPress}
              type={actionButtonType}
            />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderStyle: "dashed",
    paddingVertical: 36,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    gap: 8,
  },
  iconContainer: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  title: {
    textAlign: "center",
  },
  description: {
    textAlign: "center",
    maxWidth: 290,
  },
  actionContainer: {
    marginTop: 12,
  },
  pillButton: {
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
