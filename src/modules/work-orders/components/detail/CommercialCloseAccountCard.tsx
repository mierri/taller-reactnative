import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Wallet } from "lucide-react-native";
import { useTheme } from "@/theme";
import { formatCurrency } from "../../utils/detail-formatters";

export interface CommercialCloseAccountCardProps {
  advanceTotal: number;
  onOpenRegisterAdvance: () => void;
}

export const CommercialCloseAccountCard: React.FC<
  CommercialCloseAccountCardProps
> = ({ advanceTotal, onOpenRegisterAdvance }) => {
  const { colors, typography, radius, shadows } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surfaceCard,
          borderColor: colors.borderCard,
          borderRadius: radius.xl,
        },
        shadows.card,
      ]}
    >
      <Text style={[typography.eyebrow, { color: colors.textMuted }]}>
        ESTADO DE CUENTA
      </Text>

      <View style={styles.amountLine}>
        <Text style={[typography.bodyMd, { color: colors.textSecondary }]}>
          Anticipos registrados
        </Text>
        <Text
          style={[
            typography.bodyMd,
            styles.amountText,
            { color: colors.textStrong },
          ]}
        >
          {formatCurrency(advanceTotal)}
        </Text>
      </View>

      <TouchableOpacity
        onPress={onOpenRegisterAdvance}
        activeOpacity={0.8}
        style={[
          styles.advanceButton,
          {
            backgroundColor: colors.surfaceInput,
            borderColor: colors.borderButton,
            borderRadius: radius.xl,
          },
        ]}
      >
        <Wallet size={18} color={colors.brandPrimary} strokeWidth={2} />
        <Text
          style={[
            typography.buttonMd,
            styles.advanceButtonText,
            { color: colors.brandPrimary },
          ]}
        >
          Registrar anticipo
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 18,
    borderWidth: 1,
    gap: 14,
  },
  amountLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  amountText: {
    fontSize: 14,
    fontWeight: "500",
  },
  advanceButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    borderWidth: 1,
    gap: 8,
    marginTop: 4,
  },
  advanceButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
});

