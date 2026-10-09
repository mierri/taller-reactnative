import { useTheme } from "@/theme";
import { Lock, X } from "lucide-react-native";
import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { formatCurrency } from "../../utils/detail-formatters";

export interface ConfirmCommercialCloseSheetProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  subtotal: number;
  discountAmount?: number;
  taxAmount: number;
  total: number;
  advanceTotal: number;
}

export const ConfirmCommercialCloseSheet: React.FC<
  ConfirmCommercialCloseSheetProps
> = ({
  visible,
  onClose,
  onConfirm,
  subtotal,
  discountAmount = 0,
  taxAmount,
  total,
  advanceTotal,
}) => {
  const { colors, typography, radius } = useTheme();

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const saldoAlCierre = Math.max(0, total - advanceTotal);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.backdrop, { backgroundColor: colors.overlayScrim }]}>
        <TouchableOpacity
          style={styles.dismissOverlay}
          activeOpacity={1}
          onPress={onClose}
        />
        <View
          style={[
            styles.sheetContainer,
            {
              backgroundColor: colors.surfaceSheet,
              borderTopLeftRadius: radius.sheet,
              borderTopRightRadius: radius.sheet,
            },
          ]}
        >
          <View
            style={[
              styles.dragIndicator,
              { backgroundColor: colors.borderGrabber },
            ]}
          />

          <View style={styles.headerRow}>
            <Text
              style={[
                typography.headingMd,
                styles.title,
                { color: colors.textStrong },
              ]}
            >
              Confirma el total definitivo
            </Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.surfaceCard,
                borderColor: colors.borderCard,
                borderRadius: radius.xl,
              },
            ]}
          >
            <View style={styles.row}>
              <Text style={[typography.bodyMd, { color: colors.textSecondary }]}>
                Subtotal
              </Text>
              <Text style={[typography.bodyMd, { color: colors.textStrong, fontWeight: "500" }]}>
                {formatCurrency(subtotal)}
              </Text>
            </View>

            {discountAmount > 0 && (
              <View style={styles.row}>
                <Text style={[typography.bodyMd, { color: colors.textSecondary }]}>
                  Descuento
                </Text>
                <Text style={[typography.bodyMd, { color: colors.statusDangerFg, fontWeight: "500" }]}>
                  -{formatCurrency(discountAmount)}
                </Text>
              </View>
            )}

            <View style={styles.row}>
              <Text style={[typography.bodyMd, { color: colors.textSecondary }]}>
                IVA (16%)
              </Text>
              <Text style={[typography.bodyMd, { color: colors.textStrong, fontWeight: "500" }]}>
                {formatCurrency(taxAmount)}
              </Text>
            </View>

            <View
              style={[styles.divider, { backgroundColor: colors.borderDivider }]}
            />

            <View style={styles.row}>
              <Text style={[typography.headingMd, { color: colors.textStrong }]}>
                Total
              </Text>
              <View style={styles.totalValueRow}>
                <Text
                  style={[
                    typography.headingLg,
                    { color: colors.brandPrimary, fontWeight: "700" },
                  ]}
                >
                  {formatCurrency(total)}
                </Text>
                <Text style={[typography.caption, { color: colors.textMuted }]}>
                  MXN
                </Text>
              </View>
            </View>

            {advanceTotal > 0 && (
              <View style={styles.row}>
                <Text style={[typography.bodyMd, { color: colors.textSecondary }]}>
                  Anticipos
                </Text>
                <Text style={[typography.bodyMd, { color: colors.statusDangerFg, fontWeight: "500" }]}>
                  -{formatCurrency(advanceTotal)}
                </Text>
              </View>
            )}

            <View style={styles.row}>
              <Text style={[typography.headingMd, { color: colors.textStrong }]}>
                Saldo al cierre
              </Text>
              <Text
                style={[
                  typography.headingMd,
                  { color: colors.brandPrimary, fontWeight: "700" },
                ]}
              >
                {formatCurrency(saldoAlCierre)}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleConfirm}
            style={[
              styles.confirmBtn,
              {
                backgroundColor: colors.brandPrimary,
                borderRadius: radius.xl,
              },
            ]}
          >
            <Text
              style={[
                typography.buttonMd,
                styles.confirmBtnText,
                { color: colors.textOnBrand },
              ]}
            >
              Confirmar y congelar
            </Text>
            <Lock size={16} color={colors.textOnBrand} strokeWidth={2.4} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
  },
  dismissOverlay: {
    flex: 1,
  },
  sheetContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 36,
    gap: 16,
  },
  dragIndicator: {
    width: 38,
    height: 4.5,
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 4,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  card: {
    padding: 18,
    borderWidth: 1,
    gap: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  totalValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  divider: {
    height: 1,
    marginVertical: 2,
  },
  confirmBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 52,
    gap: 8,
    marginTop: 4,
  },
  confirmBtnText: {
    fontWeight: "700",
    fontSize: 15,
  },
});
