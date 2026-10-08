import { BottomSheet } from "@/components";
import { useTheme } from "@/theme";
import {
    Package,
    Plus,
    Search,
    UserPlus,
    Wallet,
    X,
} from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { WorkOrderCardModel } from "../types/work-order.types";
import { QuickActionRow } from "./QuickActionRow";
import { RecentOrderRow } from "./RecentOrderRow";

export interface OrderCommandPaletteSheetProps {
  visible: boolean;
  onClose: () => void;
  orders: WorkOrderCardModel[];
  onSelectOrder: (orderId: string) => void;
  onReceiveVehicle: () => void;
  onNewClient: () => void;
  onRegisterPayment: () => void;
  onConsultParts: () => void;
}

export const OrderCommandPaletteSheet: React.FC<
  OrderCommandPaletteSheetProps
> = ({
  visible,
  onClose,
  orders,
  onSelectOrder,
  onReceiveVehicle,
  onNewClient,
  onRegisterPayment,
  onConsultParts,
}) => {
  const { colors, radius, typography } = useTheme();
  const [query, setQuery] = useState("");

  const matchingOrders = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];
    return orders.filter(
      (o) =>
        o.folio.toLowerCase().includes(trimmed) ||
        o.client.toLowerCase().includes(trimmed) ||
        o.vehicle.toLowerCase().includes(trimmed) ||
        o.plate.toLowerCase().includes(trimmed),
    );
  }, [orders, query]);

  const recentOrders = useMemo(() => orders.slice(0, 3), [orders]);

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="¿Qué necesitas encontrar?"
    >
      <View style={styles.container}>
        <View
          style={[
            styles.searchBox,
            {
              backgroundColor: colors.surfaceInput,
              borderColor: colors.borderInput,
              borderRadius: radius.lg,
            },
          ]}
        >
          <Search size={18} color={colors.textPlaceholder} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Orden, cliente o placas"
            placeholderTextColor={colors.textPlaceholder}
            style={[
              typography.bodyMd,
              styles.searchInput,
              { color: colors.textStrong },
            ]}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery("")} hitSlop={8}>
              <X size={16} color={colors.textMuted} />
            </Pressable>
          )}
        </View>

        {query.trim().length > 0 ? (
          <View style={styles.section}>
            <Text
              style={[
                typography.captionMedium,
                styles.sectionHeader,
                { color: colors.textMuted },
              ]}
            >
              RESULTADOS ({matchingOrders.length})
            </Text>

            {matchingOrders.length > 0 ? (
              <View
                style={[
                  styles.card,
                  {
                    backgroundColor: colors.surfaceInput,
                    borderColor: colors.borderCard,
                    borderRadius: radius.xl,
                  },
                ]}
              >
                {matchingOrders.map((order, idx) => (
                  <RecentOrderRow
                    key={order.id}
                    order={order}
                    showDivider={idx < matchingOrders.length - 1}
                    onPress={() => {
                      onClose();
                      onSelectOrder(order.id);
                    }}
                  />
                ))}
              </View>
            ) : (
              <Text style={[typography.bodyMd, { color: colors.textMuted }]}>
                No se encontraron órdenes que coincidan con &quot;{query}&quot;.
              </Text>
            )}
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <Text
                style={[
                  typography.captionMedium,
                  styles.sectionHeader,
                  { color: colors.textMuted },
                ]}
              >
                ACCIONES RÁPIDAS
              </Text>

              <View
                style={[
                  styles.card,
                  {
                    backgroundColor: colors.surfaceInput,
                    borderColor: colors.borderCard,
                    borderRadius: radius.xl,
                  },
                ]}
              >
                <QuickActionRow
                  title="Recibir un vehículo"
                  subtitle="Nueva orden de trabajo"
                  icon={
                    <Plus
                      size={20}
                      color={colors.brandPrimary}
                      strokeWidth={2.4}
                    />
                  }
                  onPress={() => {
                    onClose();
                    onReceiveVehicle();
                  }}
                />
                <QuickActionRow
                  title="Registrar nuevo cliente"
                  subtitle="Alta en el directorio del taller"
                  icon={
                    <UserPlus
                      size={20}
                      color={colors.brandPrimary}
                      strokeWidth={2.2}
                    />
                  }
                  onPress={() => {
                    onClose();
                    onNewClient();
                  }}
                />
                <QuickActionRow
                  title="Registrar pago o anticipo"
                  subtitle="Abrir caja del taller"
                  icon={
                    <Wallet
                      size={20}
                      color={colors.brandPrimary}
                      strokeWidth={2}
                    />
                  }
                  onPress={() => {
                    onClose();
                    onRegisterPayment();
                  }}
                />
                <QuickActionRow
                  title="Consultar una refacción"
                  icon={
                    <Package
                      size={20}
                      color={colors.brandPrimary}
                      strokeWidth={2}
                    />
                  }
                  isDown
                  showDivider={false}
                  onPress={() => {
                    onClose();
                    onConsultParts();
                  }}
                />
              </View>
            </View>

            {recentOrders.length > 0 && (
              <View style={styles.section}>
                <Text
                  style={[
                    typography.captionMedium,
                    styles.sectionHeader,
                    { color: colors.textMuted },
                  ]}
                >
                  ÓRDENES RECIENTES
                </Text>

                <View
                  style={[
                    styles.card,
                    {
                      backgroundColor: colors.surfaceInput,
                      borderColor: colors.borderCard,
                      borderRadius: radius.xl,
                    },
                  ]}
                >
                  {recentOrders.map((order, idx) => (
                    <RecentOrderRow
                      key={order.id}
                      order={order}
                      showDivider={idx < recentOrders.length - 1}
                      onPress={() => {
                        onClose();
                        onSelectOrder(order.id);
                      }}
                    />
                  ))}
                </View>
              </View>
            )}
          </>
        )}
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 20,
    paddingTop: 4,
  },
  searchBox: {
    height: 48,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    padding: 0,
  },
  section: {
    gap: 8,
  },
  sectionHeader: {
    letterSpacing: 0.8,
  },
  card: {
    borderWidth: 1,
    overflow: "hidden",
  },
});
