import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { ClipboardList } from "lucide-react-native";
import { useTheme } from "@/theme";
import { Button, ButtonType } from "./Button";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  actionLabel?: string;
  actionButtonType?: ButtonType;
  onActionPress?: () => void;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title = "Tu primer vehículo empieza aquí",
  description = "Toca Recibir auto para registrar al cliente y comenzar el diagnóstico.",
  actionLabel,
  actionButtonType = "Secondary",
  onActionPress,
  style,
}) => {
  const { colors, typography, radius } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: colors.borderDashed,
          borderRadius: radius.xl,
        },
        style,
      ]}
    >
      <View style={styles.iconContainer}>
        {icon ?? <ClipboardList size={32} color={colors.textMuted} />}
      </View>

      <Text
        style={[
          typography.buttonMd,
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
          <Button
            label={actionLabel}
            onPress={onActionPress}
            type={actionButtonType}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderStyle: "dashed",
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    gap: 8,
    backgroundColor: "transparent",
  },
  iconContainer: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  title: {
    textAlign: "center",
  },
  description: {
    textAlign: "center",
    maxWidth: 280,
  },
  actionContainer: {
    marginTop: 12,
  },
});
