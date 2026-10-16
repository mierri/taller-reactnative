import { BottomSheet } from "@/components";
import { formatCurrency } from "@/modules/work-orders";
import { useTheme } from "@/theme";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ChargeableOrderItem } from "../types/cash.types";

export interface SelectOrderToChargeSheetProps {
  visible: boolean;
  onClose: () => void;
  orders: ChargeableOrderItem[];
  onSelectOrder: (order: ChargeableOrderItem) => void;
}

export const SelectOrderToChargeSheet: React.FC<
  SelectOrderToChargeSheetProps
> = ({ visible, onClose, orders, onSelectOrder }) => {
  const { colors, typography, radius } = useTheme();

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="¿Qué orden vamos a cobrar?"
    >
      <View style={styles.container}>
        <Text style={[typography.bodyMd, { color: colors.textSecondary }]}>
          Selecciona una orden para cobrar o registrar un anticipo.
        </Text>

        <View style={styles.list}>
          {orders.map((order) => {
            const rightLabel =
              order.isCommercialClosed && order.pendingBalance !== undefined
                ? formatCurrency(order.pendingBalance)
                : "Anticipo";

            return (
              <TouchableOpacity
                key={order.id}
                onPress={() => onSelectOrder(order)}
                activeOpacity={0.8}
                style={[
                  styles.orderCard,
                  {
                    backgroundColor: colors.surfaceCard,
                    borderColor: colors.borderCard,
                    borderRadius: radius.xl,
                  },
                ]}
              >
                <View style={styles.leftColumn}>
                  <Text
                    style={[typography.titleCard, { color: colors.textStrong }]}
                  >
                    {order.vehicleName}
                  </Text>
                  <Text
                    style={[typography.caption, { color: colors.textMuted }]}
                  >
                    {order.folio} · {order.clientName}
                  </Text>
                </View>

                <Text
                  style={[typography.labelMd, { color: colors.brandPrimary }]}
                >
                  {rightLabel}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
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
  list: {
    gap: 10,
  },
  orderCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderWidth: 1,
  },
  leftColumn: {
    gap: 2,
  },
});

