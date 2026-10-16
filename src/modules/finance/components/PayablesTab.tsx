import { Badge, EmptyState } from "@/components";
import { formatCurrency } from "@/modules/work-orders";
import { useTheme } from "@/theme";
import { Plus, Repeat } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AccountPayableItem } from "../types/finance.types";

export interface PayablesTabProps {
  payables: AccountPayableItem[];
  onOpenNewPayable: () => void;
  onPayToSupplier: (item: AccountPayableItem) => void;
}

export const PayablesTab: React.FC<PayablesTabProps> = ({
  payables,
  onOpenNewPayable,
  onPayToSupplier,
}) => {
  const { colors, typography, radius, shadows } = useTheme();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onOpenNewPayable}
        activeOpacity={0.85}
        style={[
          styles.createButton,
          {
            backgroundColor: colors.surfaceCard,
            borderColor: colors.borderCard,
            borderRadius: radius.xl,
          },
          shadows.card,
        ]}
      >
        <Plus size={18} color={colors.brandPrimary} strokeWidth={2.2} />
        <Text style={[typography.buttonMd, { color: colors.brandPrimary }]}>
          Registrar cuenta de proveedor
        </Text>
      </TouchableOpacity>

      {payables.length === 0 ? (
        <EmptyState
          title="Sin cuentas por pagar"
          description="No tienes pagos pendientes a proveedores en este momento."
          actionLabel="Registrar cuenta"
          actionButtonType="PillCard"
          onActionPress={onOpenNewPayable}
        />
      ) : (
        <View style={styles.list}>
          {payables.map((item) => {
            const isPaid = item.status === "PAID" || item.balance === 0;
            const badgeFamily = isPaid
              ? "success"
              : item.status === "PARTIAL"
                ? "info"
                : "warning";
            const badgeLabel = isPaid
              ? "Liquidada"
              : item.status === "PARTIAL"
                ? "Pago parcial"
                : "Pendiente";

            return (
              <View
                key={item.id}
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
                <View style={styles.cardHeader}>
                  <Text
                    style={[typography.titleCard, { color: colors.textStrong }]}
                  >
                    {item.supplierName}
                  </Text>
                  <Badge label={badgeLabel} family={badgeFamily} />
                </View>

                <Text
                  style={[typography.bodyMd, { color: colors.textSecondary }]}
                >
                  {item.concept}
                </Text>

                <View style={styles.metaRow}>
                  <Text
                    style={[typography.caption, { color: colors.textMuted }]}
                  >
                    Vence: {item.dueDate}
                  </Text>

                  {item.recurrence?.isRecurring && (
                    <View
                      style={[
                        styles.recurrencePill,
                        {
                          backgroundColor: colors.surfaceTile,
                          borderColor: colors.borderDivider,
                          borderRadius: radius.full,
                        },
                      ]}
                    >
                      <Repeat
                        size={12}
                        color={colors.brandPrimary}
                        strokeWidth={2}
                      />
                      <Text
                        style={[
                          typography.captionMedium,
                          { color: colors.brandPrimary },
                        ]}
                      >
                        {item.recurrence.summaryLabel || "Periódico"}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.balanceRow}>
                  <Text
                    style={[typography.bodyMd, { color: colors.textSecondary }]}
                  >
                    Saldo
                  </Text>
                  <Text
                    style={[
                      typography.titleCard,
                      {
                        color: isPaid ? colors.textMuted : colors.brandPrimary,
                      },
                    ]}
                  >
                    {formatCurrency(item.balance)}
                  </Text>
                </View>

                {!isPaid && (
                  <TouchableOpacity
                    onPress={() => onPayToSupplier(item)}
                    activeOpacity={0.8}
                    style={[
                      styles.payButton,
                      {
                        backgroundColor: colors.surfaceCard,
                        borderColor: colors.borderCard,
                        borderRadius: radius.lg,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        typography.buttonMd,
                        { color: colors.brandPrimary },
                      ]}
                    >
                      Registrar pago a proveedor
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  createButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  list: {
    gap: 12,
  },
  card: {
    padding: 18,
    borderWidth: 1,
    gap: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 6,
  },
  recurrencePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderWidth: 1,
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  payButton: {
    paddingVertical: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
});
