import { BottomSheet } from "@/components";
import { formatCurrency } from "@/modules/work-orders";
import { useTheme } from "@/theme";
import { Check } from "lucide-react-native";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export interface CashCutSheetProps {
  visible: boolean;
  onClose: () => void;
  expectedCash: number;
  onSaveCut: (countedCash: number) => void;
}

export const CashCutSheet: React.FC<CashCutSheetProps> = ({
  visible,
  onClose,
  expectedCash,
  onSaveCut,
}) => {
  const { colors, typography, radius } = useTheme();
  const [countedStr, setCountedStr] = useState("");

  const hasValue = countedStr.trim().length > 0;
  const countedAmount = parseFloat(countedStr) || 0;

  const handleConfirm = () => {
    if (!hasValue) return;
    onSaveCut(countedAmount);
    setCountedStr("");
    onClose();
  };

  const handleClose = () => {
    setCountedStr("");
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={handleClose} title="Corte de caja">
      <View style={styles.container}>
        <Text
          style={[
            typography.bodyMd,
            styles.description,
            { color: colors.textSecondary },
          ]}
        >
          Compara los cobros en efectivo de hoy con el dinero contado. Incluye
          ingresos y gastos manuales en efectivo de hoy. No incluye un fondo
          inicial.
        </Text>

        <View
          style={[
            styles.expectedCard,
            {
              backgroundColor: colors.surfaceCard,
              borderColor: colors.borderCard,
              borderRadius: radius.xl,
            },
          ]}
        >
          <Text style={[typography.labelLg, { color: colors.textStrong }]}>
            Efectivo esperado
          </Text>
          <Text style={[typography.headingMd, { color: colors.brandPrimary }]}>
            {formatCurrency(expectedCash)}
          </Text>
        </View>

        <View style={styles.field}>
          <Text style={[typography.captionMedium, { color: colors.textLabel }]}>
            Efectivo contado · MXN
          </Text>
          <TextInput
            keyboardType="decimal-pad"
            placeholder="0.00"
            placeholderTextColor={colors.textPlaceholder}
            value={countedStr}
            onChangeText={setCountedStr}
            style={[
              styles.input,
              typography.headingLg,
              {
                backgroundColor: colors.surfaceInput,
                borderColor: colors.borderInput,
                borderRadius: radius.xl,
                color: colors.textStrong,
              },
            ]}
          />
        </View>

        <TouchableOpacity
          onPress={handleConfirm}
          disabled={!hasValue}
          activeOpacity={0.85}
          style={[
            styles.submitBtn,
            {
              backgroundColor: hasValue
                ? colors.brandPrimary
                : colors.borderControl,
              borderRadius: radius.xl,
            },
          ]}
        >
          <Text style={[typography.buttonMd, { color: colors.textOnBrand }]}>
            Guardar corte
          </Text>
          <Check size={18} color={colors.textOnBrand} strokeWidth={2.4} />
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingTop: 4,
    paddingBottom: 20,
  },
  description: {
    lineHeight: 20,
  },
  expectedCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderWidth: 1,
  },
  field: {
    gap: 8,
  },
  input: {
    height: 60,
    borderWidth: 1,
    paddingHorizontal: 18,
  },
  submitBtn: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
  },
});

