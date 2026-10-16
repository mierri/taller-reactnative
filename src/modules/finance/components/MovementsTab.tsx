import { EmptyState } from "@/components";
import { formatCurrency } from "@/modules/work-orders";
import { useTheme } from "@/theme";
import { Plus, ShieldCheck } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ManualMovementItem } from "../types/finance.types";

export interface MovementsTabProps {
  movements: ManualMovementItem[];
  onOpenNewMovement: () => void;
}

export const MovementsTab: React.FC<MovementsTabProps> = ({
  movements,
  onOpenNewMovement,
}) => {
  const { colors, typography, radius, shadows } = useTheme();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onOpenNewMovement}
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
          Agregar ingreso o gasto
        </Text>
      </TouchableOpacity>

      <View
        style={[
          styles.noticeBanner,
          {
            backgroundColor: colors.surfaceTile,
            borderColor: colors.borderDivider,
            borderRadius: radius.xl,
          },
        ]}
      >
        <ShieldCheck
          size={18}
          color={colors.brandPrimary}
          strokeWidth={2}
          style={styles.noticeIcon}
        />
        <Text
          style={[
            typography.captionMedium,
            styles.noticeText,
            { color: colors.textSecondary },
          ]}
        >
          Los cobros de órdenes aparecen automáticamente en Caja. Aquí registras
          otros ingresos y gastos.
        </Text>
      </View>

      {movements.length === 0 ? (
        <EmptyState
          title="Sin otros movimientos"
          description="Agrega gastos como renta o insumos, o ingresos que no pertenezcan a una orden."
          actionLabel="Registrar movimiento"
          actionButtonType="PillCard"
          onActionPress={onOpenNewMovement}
        />
      ) : (
        <View style={styles.list}>
          {movements.map((item) => {
            const isIncome = item.type === "INCOME";
            const prefix = isIncome ? "+" : "-";
            const amountColor = isIncome
              ? colors.brandPrimary
              : colors.textStrong;

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
                <View style={styles.leftColumn}>
                  <Text
                    style={[typography.titleCard, { color: colors.textStrong }]}
                  >
                    {item.concept}
                  </Text>

                  <View style={styles.metaRow}>
                    <Text
                      style={[typography.caption, { color: colors.textMuted }]}
                    >
                      {item.createdAt} · {item.paymentMethod}
                    </Text>
                  </View>
                </View>

                <Text
                  style={[
                    typography.titleCard,
                    { color: amountColor },
                  ]}
                >
                  {prefix}
                  {formatCurrency(item.amount)}
                </Text>
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
  noticeBanner: {
    padding: 14,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  noticeIcon: {
    marginTop: 1,
  },
  noticeText: {
    flex: 1,
    lineHeight: 18,
  },
  list: {
    gap: 10,
  },
  card: {
    padding: 16,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftColumn: {
    flex: 1,
    gap: 4,
    marginRight: 12,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
});
