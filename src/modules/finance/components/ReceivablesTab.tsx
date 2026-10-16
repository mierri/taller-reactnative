import { Badge, EmptyState, Switch } from "@/components";
import { formatCurrency } from "@/modules/work-orders";
import { useTheme } from "@/theme";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AccountReceivableItem } from "../types/finance.types";

export interface ReceivablesTabProps {
  receivables: AccountReceivableItem[];
  includePaid: boolean;
  onToggleIncludePaid: (val: boolean) => void;
  onSelectReceivable?: (item: AccountReceivableItem) => void;
}

export const ReceivablesTab: React.FC<ReceivablesTabProps> = ({
  receivables,
  includePaid,
  onToggleIncludePaid,
  onSelectReceivable,
}) => {
  const { colors, typography, radius, shadows } = useTheme();

  const totalPending = receivables.reduce((sum, item) => sum + item.balance, 0);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.summaryCard,
          {
            backgroundColor: colors.surfaceCard,
            borderColor: colors.borderCard,
            borderRadius: radius.xl,
          },
          shadows.card,
        ]}
      >
        <Text style={[typography.eyebrow, { color: colors.textMuted }]}>
          SALDO PENDIENTE DE CLIENTES
        </Text>
        <Text
          style={[
            typography.headingXl,
            styles.totalAmount,
            { color: colors.brandPrimary },
          ]}
        >
          {formatCurrency(totalPending)}
        </Text>
      </View>

      <View style={styles.filterRow}>
        <Switch value={includePaid} onValueChange={onToggleIncludePaid} />
        <Text style={[typography.bodyMd, { color: colors.textSecondary }]}>
          Incluir cuentas liquidadas
        </Text>
      </View>

      {receivables.length === 0 ? (
        <EmptyState
          title="Sin cuentas pendientes"
          description="Todos tus clientes están al día con sus pagos."
        />
      ) : (
        <View style={styles.list}>
          {receivables.map((item) => {
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
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.85}
                onPress={() => onSelectReceivable?.(item)}
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
                    style={[typography.captionMedium, { color: colors.textMuted }]}
                  >
                    {item.folio}
                  </Text>
                  <Badge label={badgeLabel} family={badgeFamily} />
                </View>

                <View style={styles.clientBlock}>
                  <Text
                    style={[typography.titleCard, { color: colors.textStrong }]}
                  >
                    {item.clientName}
                  </Text>
                  <Text
                    style={[typography.bodyMd, { color: colors.textSecondary }]}
                  >
                    {item.vehicleName}
                  </Text>
                </View>

                <View
                  style={[
                    styles.divider,
                    { backgroundColor: colors.borderDivider },
                  ]}
                />

                <View style={styles.cardFooter}>
                  <Text
                    style={[typography.bodyMd, { color: colors.textSecondary }]}
                  >
                    Saldo por pagar
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
              </TouchableOpacity>
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
  summaryCard: {
    padding: 22,
    borderWidth: 1,
    gap: 8,
  },
  totalAmount: {
    marginTop: 4,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 4,
  },
  list: {
    gap: 12,
  },
  card: {
    padding: 16,
    borderWidth: 1,
    gap: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  clientBlock: {
    gap: 2,
  },
  divider: {
    height: 1,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
