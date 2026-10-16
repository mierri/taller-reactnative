import { BottomSheet, Button, Field } from "@/components";
import { formatCurrency } from "@/modules/work-orders";
import { useTheme } from "@/theme";
import { Check } from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AccountPayableItem } from "../types/finance.types";

export interface PaySupplierSheetProps {
  visible: boolean;
  onClose: () => void;
  payable: AccountPayableItem | null;
  onConfirmPay: (
    payableId: string,
    amount: number,
    method: "CASH" | "TRANSFER" | "CARD",
  ) => void;
}

const methodOptions: { key: "CASH" | "TRANSFER" | "CARD"; label: string }[] = [
  { key: "CASH", label: "Efectivo" },
  { key: "TRANSFER", label: "Transferencia" },
  { key: "CARD", label: "Tarjeta" },
];

interface PaySupplierFormProps {
  payable: AccountPayableItem;
  onClose: () => void;
  onConfirmPay: (
    payableId: string,
    amount: number,
    method: "CASH" | "TRANSFER" | "CARD",
  ) => void;
}

const PaySupplierForm: React.FC<PaySupplierFormProps> = ({
  payable,
  onClose,
  onConfirmPay,
}) => {
  const { colors, typography, radius } = useTheme();

  const [amountStr, setAmountStr] = useState(() => payable.balance.toFixed(2));
  const [method, setMethod] = useState<"CASH" | "TRANSFER" | "CARD">("CASH");

  const amount = parseFloat(amountStr) || 0;
  const maxBalance = payable.balance;
  const isValid = amount > 0 && amount <= maxBalance;

  const handleConfirm = () => {
    if (!isValid) return;
    onConfirmPay(payable.id, amount, method);
    onClose();
  };

  return (
    <View style={styles.container}>
      <Text style={[typography.bodyMd, { color: colors.textSecondary }]}>
        Saldo pendiente: {formatCurrency(maxBalance)}
      </Text>

      <Field
        label="Monto a pagar · MXN"
        placeholder="0.00"
        value={amountStr}
        onChangeText={setAmountStr}
        keyboardType="decimal-pad"
      />

      <View style={styles.section}>
        <Text style={[typography.labelLg, { color: colors.textStrong }]}>
          Método de pago
        </Text>
        <View style={styles.chipsRow}>
          {methodOptions.map((opt) => {
            const isSelected = method === opt.key;
            return (
              <TouchableOpacity
                key={opt.key}
                onPress={() => setMethod(opt.key)}
                activeOpacity={0.8}
                style={[
                  styles.chip,
                  {
                    backgroundColor: isSelected
                      ? colors.brandPrimary
                      : colors.surfaceCard,
                    borderColor: isSelected
                      ? colors.brandPrimary
                      : colors.borderCard,
                    borderRadius: radius.full,
                  },
                ]}
              >
                <Text
                  style={[
                    typography.captionMedium,
                    {
                      color: isSelected
                        ? colors.surfaceCard
                        : colors.textSecondary,
                    },
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <Button
        type="Primary"
        label="Confirmar pago"
        fullWidth
        disabled={!isValid}
        onPress={handleConfirm}
        iconTrailing={
          <Check
            size={18}
            color={isValid ? colors.textOnBrand : colors.textMuted}
            strokeWidth={2.5}
          />
        }
      />
    </View>
  );
};

export const PaySupplierSheet: React.FC<PaySupplierSheetProps> = ({
  visible,
  onClose,
  payable,
  onConfirmPay,
}) => {
  return (
    <BottomSheet visible={visible} onClose={onClose} title="Pagar a proveedor">
      {payable ? (
        <PaySupplierForm
          key={payable.id}
          payable={payable}
          onClose={onClose}
          onConfirmPay={onConfirmPay}
        />
      ) : null}
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingBottom: 24,
  },
  section: {
    gap: 8,
  },
  chipsRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
});
