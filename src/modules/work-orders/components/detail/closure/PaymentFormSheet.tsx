import { BottomSheet } from "@/components";
import { useTheme } from "@/theme";
import { ChevronDown, CreditCard } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { formatCurrency } from "../../../utils/detail-formatters";

export type AdvancePaymentMethod = "CASH" | "CARD" | "TRANSFER";

export interface PaymentFormSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  orderFolio?: string;
  vehicleName?: string;
  badgeText?: string;
  initialAmount?: number;
  submitLabel?: string;
  onSave: (
    amount: number,
    method: AdvancePaymentMethod,
    commissionPercent: number,
    netAmount: number,
  ) => void;
}

const paymentOptions: { key: AdvancePaymentMethod; label: string }[] = [
  { key: "CARD", label: "Tarjeta" },
  { key: "CASH", label: "Efectivo" },
  { key: "TRANSFER", label: "Transferencia" },
];

export const PaymentFormSheet: React.FC<PaymentFormSheetProps> = ({
  visible,
  onClose,
  title = "Registrar anticipo",
  orderFolio = "OT-1049",
  vehicleName = "Nissan Versa",
  badgeText = "Anticipo",
  initialAmount,
  submitLabel = "Registrar cobro →",
  onSave,
}) => {
  const { colors, typography, radius } = useTheme();
  const [amountStr, setAmountStr] = useState(
    initialAmount && initialAmount > 0 ? initialAmount.toString() : "",
  );
  const [method, setMethod] = useState<AdvancePaymentMethod>("CARD");
  const [commissionStr, setCommissionStr] = useState("3.5");
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (visible) {
      setAmountStr(
        initialAmount && initialAmount > 0 ? initialAmount.toString() : "",
      );
      setShowPicker(false);
    }
  }, [visible, initialAmount]);

  const amount = parseFloat(amountStr) || 0;
  const isCard = method === "CARD";
  const commissionRate = isCard ? parseFloat(commissionStr) || 0 : 0;
  const commissionAmount = amount > 0 ? (amount * commissionRate) / 100 : 0;
  const netAmount = Math.max(0, amount - commissionAmount);

  const handleSave = () => {
    if (amount <= 0) return;
    onSave(amount, method, commissionRate, netAmount);
    setAmountStr("");
    setCommissionStr("3.5");
    setShowPicker(false);
    onClose();
  };

  const selectedLabel =
    paymentOptions.find((p) => p.key === method)?.label || "Tarjeta";

  return (
    <BottomSheet visible={visible} onClose={onClose} title={title}>
      <View style={styles.container}>
        <View
          style={[
            styles.contextCard,
            {
              backgroundColor: colors.surfaceCard,
              borderColor: colors.borderCard,
              borderRadius: radius.lg,
            },
          ]}
        >
          <Text style={[typography.captionMedium, { color: colors.textSecondary }]}>
            {orderFolio} · {vehicleName}
          </Text>
          <Text style={[typography.labelMd, { color: colors.brandPrimary }]}>
            {badgeText}
          </Text>
        </View>

        <View style={styles.field}>
          <Text style={[typography.captionMedium, { color: colors.textLabel }]}>
            Método de pago
          </Text>
          <TouchableOpacity
            onPress={() => setShowPicker(!showPicker)}
            activeOpacity={0.7}
            style={[
              styles.selectBox,
              {
                backgroundColor: colors.surfaceInput,
                borderColor: colors.borderInput,
                borderRadius: radius.lg,
              },
            ]}
          >
            <Text style={[typography.bodyMd, { color: colors.textStrong }]}>
              {selectedLabel}
            </Text>
            <ChevronDown size={18} color={colors.textSecondary} />
          </TouchableOpacity>

          {showPicker && (
            <View
              style={[
                styles.dropdownMenu,
                {
                  backgroundColor: colors.surfaceInput,
                  borderColor: colors.borderInput,
                  borderRadius: radius.lg,
                },
              ]}
            >
              {paymentOptions.map((opt) => (
                <TouchableOpacity
                  key={opt.key}
                  onPress={() => {
                    setMethod(opt.key);
                    setShowPicker(false);
                  }}
                  activeOpacity={0.7}
                  style={[
                    styles.dropdownOption,
                    method === opt.key && {
                      backgroundColor: colors.surfaceTile,
                    },
                  ]}
                >
                  <Text
                    style={[
                      method === opt.key ? typography.labelMd : typography.bodyMd,
                      {
                        color:
                          method === opt.key
                            ? colors.brandPrimary
                            : colors.textStrong,
                      },
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {isCard && (
          <View style={styles.field}>
            <Text style={[typography.captionMedium, { color: colors.textLabel }]}>
              Comisión de la terminal · %
            </Text>
            <TextInput
              keyboardType="decimal-pad"
              value={commissionStr}
              onChangeText={setCommissionStr}
              style={[
                styles.commissionInput,
                typography.bodyLg,
                {
                  backgroundColor: colors.surfaceInput,
                  borderColor: colors.borderInput,
                  borderRadius: radius.lg,
                  color: colors.textStrong,
                },
              ]}
            />
            <Text style={[typography.caption, { color: colors.textMuted }]}>
              Usa el porcentaje que aplica tu banco para este cobro.
            </Text>
          </View>
        )}

        <View style={styles.field}>
          <Text style={[typography.captionMedium, { color: colors.textLabel }]}>
            Monto a registrar · MXN
          </Text>
          <TextInput
            keyboardType="decimal-pad"
            placeholder="0.00"
            placeholderTextColor={colors.textPlaceholder}
            value={amountStr}
            onChangeText={setAmountStr}
            style={[
              styles.amountInput,
              typography.headingXl,
              {
                backgroundColor: colors.surfaceInput,
                borderColor: colors.borderInput,
                borderRadius: radius.lg,
                color: colors.textStrong,
              },
            ]}
          />
        </View>

        <View
          style={[
            styles.breakdownCard,
            {
              backgroundColor: colors.surfaceCard,
              borderColor: colors.borderCard,
              borderRadius: radius.lg,
            },
          ]}
        >
          {isCard && (
            <View style={styles.breakdownRow}>
              <Text style={[typography.captionMedium, { color: colors.textMuted }]}>
                Comisión ({commissionRate}%)
              </Text>
              <Text style={[typography.captionMedium, { color: colors.textMuted }]}>
                -{formatCurrency(commissionAmount)}
              </Text>
            </View>
          )}

          <View style={styles.breakdownRow}>
            <Text style={[typography.bodyMd, { color: colors.textStrong }]}>
              Neto recibido en caja
            </Text>
            <Text style={[typography.labelLg, { color: colors.textStrong }]}>
              {formatCurrency(netAmount)}
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.borderDivider }]} />

          <View style={styles.breakdownRow}>
            <Text style={[typography.labelMd, { color: colors.brandPrimary }]}>
              Saldo amortizado al cliente
            </Text>
            <Text style={[typography.labelLg, { color: colors.brandPrimary }]}>
              {formatCurrency(amount)}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSave}
          disabled={amount <= 0}
          activeOpacity={0.8}
          style={[
            styles.submitButton,
            {
              backgroundColor: amount > 0 ? colors.brandPrimary : colors.borderControl,
              borderRadius: radius.xl,
            },
          ]}
        >
          <CreditCard size={18} color={colors.textOnBrand} strokeWidth={2} />
          <Text style={[typography.buttonMd, { color: colors.textOnBrand }]}>
            {submitLabel}
          </Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: { gap: 16, paddingTop: 4, paddingBottom: 24 },
  contextCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
  },
  field: { gap: 6 },
  selectBox: {
    height: 48,
    borderWidth: 1,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownMenu: { borderWidth: 1, overflow: "hidden" },
  dropdownOption: { paddingVertical: 12, paddingHorizontal: 16 },
  commissionInput: {
    height: 48,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  amountInput: {
    height: 64,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  breakdownCard: { padding: 16, borderWidth: 1, gap: 10 },
  breakdownRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  divider: { height: 1, marginVertical: 2 },
  submitButton: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
  },
});

