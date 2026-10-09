import { useTheme } from "@/theme";
import { ChevronDown, CreditCard, X } from "lucide-react-native";
import React, { useState } from "react";
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { formatCurrency } from "../../utils/detail-formatters";
import { AdvancePaymentMethod } from "./RegisterAdvanceSheet";

export interface RegisterPaymentSheetProps {
  visible: boolean;
  onClose: () => void;
  orderFolio?: string;
  vehicleName?: string;
  pendingBalance: number;
  onSavePayment: (amount: number, method: AdvancePaymentMethod, commissionPercent: number, netAmount: number) => void;
}

const paymentOptions: { key: AdvancePaymentMethod; label: string }[] = [
  { key: "CARD", label: "Tarjeta" },
  { key: "CASH", label: "Efectivo" },
  { key: "TRANSFER", label: "Transferencia" },
];

export const RegisterPaymentSheet: React.FC<RegisterPaymentSheetProps> = ({
  visible,
  onClose,
  orderFolio = "OT-1049",
  vehicleName = "Nissan Versa",
  pendingBalance = 700,
  onSavePayment,
}) => {
  const { colors, typography, radius } = useTheme();
  const [method, setMethod] = useState<AdvancePaymentMethod>("CARD");
  const [showMethodDropdown, setShowMethodDropdown] = useState(false);
  const [commissionStr, setCommissionStr] = useState("3.5");
  const [amountStr, setAmountStr] = useState(pendingBalance.toString());

  const parsedAmount = parseFloat(amountStr) || 0;
  const parsedCommissionPercent = method === "CARD" ? parseFloat(commissionStr) || 0 : 0;
  const commissionAmount = (parsedAmount * parsedCommissionPercent) / 100;
  const netAmount = Math.max(0, parsedAmount - commissionAmount);

  const handleSelectMethod = (selected: AdvancePaymentMethod) => {
    setMethod(selected);
    setShowMethodDropdown(false);
    setCommissionStr(selected === "CARD" ? "3.5" : "0");
  };

  const handleConfirm = () => {
    if (parsedAmount <= 0) return;
    onSavePayment(parsedAmount, method, parsedCommissionPercent, netAmount);
    onClose();
  };

  const currentMethodLabel = paymentOptions.find((p) => p.key === method)?.label || "Tarjeta";

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={[styles.backdrop, { backgroundColor: colors.overlayScrim }]}>
        <TouchableOpacity style={styles.dismissOverlay} activeOpacity={1} onPress={onClose} />
        <View style={[styles.sheetContainer, { backgroundColor: colors.surfaceSheet, borderTopLeftRadius: radius.sheet, borderTopRightRadius: radius.sheet }]}>
          <View style={[styles.dragIndicator, { backgroundColor: colors.borderGrabber }]} />

          <View style={styles.headerRow}>
            <Text style={[typography.headingMd, styles.title, { color: colors.textStrong }]}>
              Cobrar orden
            </Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={[styles.orderPill, { backgroundColor: colors.surfaceCard, borderColor: colors.borderCard, borderRadius: radius.xl }]}>
            <Text style={[typography.bodyMd, styles.orderPillText, { color: colors.textSecondary }]}>
              {orderFolio} · {vehicleName}
            </Text>
            <Text style={[typography.headingMd, { color: colors.brandPrimary, fontWeight: "700" }]}>
              {formatCurrency(pendingBalance)}
            </Text>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={[typography.captionMedium, { color: colors.textSecondary }]}>Método de pago</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowMethodDropdown(!showMethodDropdown)}
              style={[styles.dropdownButton, { backgroundColor: colors.surfaceCard, borderColor: colors.borderInput, borderRadius: radius.md }]}
            >
              <Text style={[typography.bodyMd, { color: colors.textStrong }]}>{currentMethodLabel}</Text>
              <ChevronDown size={18} color={colors.textSecondary} />
            </TouchableOpacity>

            {showMethodDropdown && (
              <View style={[styles.dropdownMenu, { backgroundColor: colors.surfaceCard, borderColor: colors.borderCard, borderRadius: radius.md }]}>
                {paymentOptions.map((opt) => (
                  <TouchableOpacity key={opt.key} onPress={() => handleSelectMethod(opt.key)} style={styles.dropdownMenuItem}>
                    <Text style={[typography.bodyMd, { color: method === opt.key ? colors.brandPrimary : colors.textStrong, fontWeight: method === opt.key ? "700" : "400" }]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {method === "CARD" && (
            <View style={styles.fieldGroup}>
              <Text style={[typography.captionMedium, { color: colors.textSecondary }]}>Comisión de la terminal · %</Text>
              <TextInput
                value={commissionStr}
                onChangeText={setCommissionStr}
                keyboardType="numeric"
                style={[styles.input, { backgroundColor: colors.surfaceCard, borderColor: colors.borderInput, color: colors.textStrong, borderRadius: radius.md }]}
              />
              <Text style={[typography.caption, { color: colors.textMuted }]}>
                Usa el porcentaje que aplica tu banco para este cobro.
              </Text>
            </View>
          )}

          <View style={styles.fieldGroup}>
            <Text style={[typography.captionMedium, { color: colors.textSecondary }]}>Monto a registrar · MXN</Text>
            <TextInput
              value={amountStr}
              onChangeText={setAmountStr}
              keyboardType="numeric"
              style={[styles.amountInput, { backgroundColor: colors.surfaceCard, borderColor: colors.borderInput, color: colors.textStrong, borderRadius: radius.md }]}
            />
          </View>

          <View style={[styles.summaryCard, { backgroundColor: colors.surfaceCard, borderColor: colors.borderCard, borderRadius: radius.xl }]}>
            {method === "CARD" && parsedCommissionPercent > 0 && (
              <View style={styles.row}>
                <Text style={[typography.captionMedium, { color: colors.textSecondary }]}>Comisión ({parsedCommissionPercent}%)</Text>
                <Text style={[typography.captionMedium, { color: colors.statusDangerFg }]}>-{formatCurrency(commissionAmount)}</Text>
              </View>
            )}
            <View style={styles.row}>
              <Text style={[typography.captionMedium, { color: colors.textSecondary }]}>Neto recibido en caja</Text>
              <Text style={[typography.captionMedium, { color: colors.textStrong, fontWeight: "700" }]}>{formatCurrency(netAmount)}</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.borderDivider }]} />
            <View style={styles.row}>
              <Text style={[typography.bodyMd, { color: colors.brandPrimary, fontWeight: "600" }]}>Saldo amortizado al cliente</Text>
              <Text style={[typography.headingMd, { color: colors.brandPrimary, fontWeight: "700" }]}>{formatCurrency(parsedAmount)}</Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleConfirm}
            style={[styles.confirmBtn, { backgroundColor: colors.brandPrimary, borderRadius: radius.xl }]}
          >
            <CreditCard size={18} color={colors.textOnBrand} strokeWidth={2.4} />
            <Text style={[typography.buttonMd, styles.confirmBtnText, { color: colors.textOnBrand }]}>
              Registrar cobro y liquidar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: "flex-end" },
  dismissOverlay: { flex: 1 },
  sheetContainer: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 36, gap: 14 },
  dragIndicator: { width: 38, height: 4.5, borderRadius: 3, alignSelf: "center", marginBottom: 4 },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { fontSize: 18, fontWeight: "700" },
  orderPill: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1 },
  orderPillText: { fontSize: 13.5, fontWeight: "500" },
  fieldGroup: { gap: 6 },
  dropdownButton: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 14, height: 48, borderWidth: 1 },
  dropdownMenu: { borderWidth: 1, marginTop: 4, paddingVertical: 4 },
  dropdownMenuItem: { paddingHorizontal: 14, paddingVertical: 10 },
  input: { paddingHorizontal: 14, height: 46, borderWidth: 1, fontSize: 15 },
  amountInput: { paddingHorizontal: 14, height: 52, borderWidth: 1, fontSize: 22, fontWeight: "700" },
  summaryCard: { padding: 14, borderWidth: 1, gap: 8 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  divider: { height: 1, marginVertical: 2 },
  confirmBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", height: 52, gap: 8, marginTop: 4 },
  confirmBtnText: { fontWeight: "700", fontSize: 15 },
});
