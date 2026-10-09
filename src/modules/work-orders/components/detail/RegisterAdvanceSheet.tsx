import { BottomSheet } from "@/components";
import { useTheme } from "@/theme";
import { ChevronDown, CreditCard } from "lucide-react-native";
import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export type AdvancePaymentMethod = "CASH" | "CARD" | "TRANSFER";

export interface RegisterAdvanceSheetProps {
  visible: boolean;
  onClose: () => void;
  orderFolio?: string;
  vehicleName?: string;
  onSaveAdvance: (
    amount: number,
    method: AdvancePaymentMethod,
    commissionPercent?: number,
    netAmount?: number,
    reference?: string,
  ) => void;
}

const paymentOptions: { key: AdvancePaymentMethod; label: string }[] = [
  { key: "CARD", label: "Tarjeta" },
  { key: "CASH", label: "Efectivo" },
  { key: "TRANSFER", label: "Transferencia" },
];

const formatCurrency = (val: number) =>
  val.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const RegisterAdvanceSheet: React.FC<RegisterAdvanceSheetProps> = ({
  visible,
  onClose,
  orderFolio = "OT-1049",
  vehicleName = "Nissan Versa",
  onSaveAdvance,
}) => {
  const { colors, typography, radius } = useTheme();
  const [amountStr, setAmountStr] = useState("");
  const [method, setMethod] = useState<AdvancePaymentMethod>("CARD");
  const [commissionStr, setCommissionStr] = useState("3.5");
  const [showPicker, setShowPicker] = useState(false);

  const amount = parseFloat(amountStr) || 0;
  const isCard = method === "CARD";
  const commissionRate = isCard ? parseFloat(commissionStr) || 0 : 0;
  const commissionAmount = amount > 0 ? (amount * commissionRate) / 100 : 0;
  const netAmount = Math.max(0, amount - commissionAmount);
  const amortizedAmount = amount;

  const handleSave = () => {
    if (amount <= 0) return;
    onSaveAdvance(amount, method, commissionRate, netAmount);
    setAmountStr("");
    setCommissionStr("3.5");
    setShowPicker(false);
    onClose();
  };

  const selectedLabel =
    paymentOptions.find((p) => p.key === method)?.label || "Tarjeta";

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Registrar anticipo">
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
          <Text
            style={[
              typography.captionMedium,
              styles.contextLeft,
              { color: colors.textSecondary },
            ]}
          >
            {orderFolio} · {vehicleName}
          </Text>
          <Text
            style={[
              typography.captionMedium,
              styles.contextRight,
              { color: colors.brandPrimary },
            ]}
          >
            Anticipo
          </Text>
        </View>

        <View style={styles.field}>
          <Text
            style={[
              typography.captionMedium,
              styles.label,
              { color: colors.textLabel },
            ]}
          >
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
            <Text
              style={[
                typography.bodyMd,
                styles.selectText,
                { color: colors.textStrong },
              ]}
            >
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
                      typography.bodyMd,
                      {
                        color:
                          method === opt.key
                            ? colors.brandPrimary
                            : colors.textStrong,
                        fontWeight: method === opt.key ? "700" : "500",
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
            <Text
              style={[
                typography.captionMedium,
                styles.label,
                { color: colors.textLabel },
              ]}
            >
              Comisión de la terminal · %
            </Text>
            <TextInput
              keyboardType="decimal-pad"
              value={commissionStr}
              onChangeText={setCommissionStr}
              style={[
                styles.commissionInput,
                {
                  backgroundColor: colors.surfaceInput,
                  borderColor: colors.borderInput,
                  borderRadius: radius.lg,
                  color: colors.textStrong,
                },
              ]}
            />
            <Text
              style={[
                typography.caption,
                styles.helperCaption,
                { color: colors.textMuted },
              ]}
            >
              Usa el porcentaje que aplica tu banco para este cobro.
            </Text>
          </View>
        )}

        <View style={styles.field}>
          <Text
            style={[
              typography.captionMedium,
              styles.label,
              { color: colors.textLabel },
            ]}
          >
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
              <Text
                style={[
                  typography.captionMedium,
                  styles.breakdownMutedText,
                  { color: colors.textMuted },
                ]}
              >
                Comisión ({commissionRate}%)
              </Text>
              <Text
                style={[
                  typography.captionMedium,
                  styles.breakdownMutedText,
                  { color: colors.textMuted },
                ]}
              >
                -${formatCurrency(commissionAmount)}
              </Text>
            </View>
          )}

          <View style={styles.breakdownRow}>
            <Text
              style={[
                typography.bodyMd,
                styles.breakdownRegularText,
                { color: colors.textStrong },
              ]}
            >
              Neto recibido en caja
            </Text>
            <Text
              style={[
                typography.bodyMd,
                styles.breakdownBoldText,
                { color: colors.textStrong },
              ]}
            >
              ${formatCurrency(netAmount)}
            </Text>
          </View>

          <View
            style={[styles.divider, { backgroundColor: colors.borderDivider }]}
          />

          <View style={styles.breakdownRow}>
            <Text
              style={[
                typography.bodyMd,
                styles.breakdownGreenText,
                { color: colors.brandPrimary },
              ]}
            >
              Saldo amortizado al cliente
            </Text>
            <Text
              style={[
                typography.bodyMd,
                styles.breakdownGreenBoldText,
                { color: colors.brandPrimary },
              ]}
            >
              ${formatCurrency(amortizedAmount)}
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
              backgroundColor: amount > 0 ? colors.brandPrimary : "#8ca89a",
              borderRadius: radius.xl,
            },
          ]}
        >
          <CreditCard size={18} color="#ffffff" strokeWidth={2} />
          <Text style={[typography.buttonMd, styles.submitButtonText]}>
            Registrar cobro →
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
  contextLeft: { fontSize: 13.5 },
  contextRight: { fontSize: 14, fontWeight: "700" },
  field: { gap: 6 },
  label: { fontSize: 13 },
  selectBox: {
    height: 48,
    borderWidth: 1,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectText: { fontSize: 14.5 },
  dropdownMenu: { borderWidth: 1, overflow: "hidden" },
  dropdownOption: { paddingVertical: 12, paddingHorizontal: 16 },
  commissionInput: {
    height: 48,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  helperCaption: { fontSize: 12, marginTop: 2 },
  amountInput: {
    height: 64,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 28,
    fontWeight: "600",
  },
  breakdownCard: { padding: 16, borderWidth: 1, gap: 10 },
  breakdownRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  breakdownMutedText: { fontSize: 13 },
  breakdownRegularText: { fontSize: 13.5, fontWeight: "500" },
  breakdownBoldText: { fontSize: 14.5, fontWeight: "700" },
  divider: { height: 1, marginVertical: 2 },
  breakdownGreenText: { fontSize: 13.5, fontWeight: "600" },
  breakdownGreenBoldText: { fontSize: 14.5, fontWeight: "700" },
  infoBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderWidth: 1,
    backgroundColor: "#eaf3ec",
    borderColor: "#d2e5d8",
  },
  infoBannerText: { flex: 1, fontSize: 12.5, lineHeight: 18, color: "#27553f" },
  submitButton: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
  },
  submitButtonText: { fontSize: 15, fontWeight: "700", color: "#ffffff" },
});
