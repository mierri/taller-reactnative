import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { User, Wrench } from "lucide-react-native";
import { AppHeader } from "@/components";
import { useTheme } from "@/theme";
import { WorkOrderDetailCard } from "../components/WorkOrderDetailCard";
import { fetchWorkOrderById } from "../services/work-orders.service";
import { WorkOrderCardModel, WorkOrderDto } from "../types/work-order.types";
import { mapWorkOrderToCard } from "../utils/work-order-mapper";

export interface WorkOrderDetailScreenProps {
  id: string;
}

export const WorkOrderDetailScreen: React.FC<WorkOrderDetailScreenProps> = ({
  id,
}) => {
  const { colors, layout, radius, shadows, typography } = useTheme();
  const [order, setOrder] = useState<WorkOrderCardModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const dto: WorkOrderDto = await fetchWorkOrderById(id);
        if (isMounted) {
          setOrder(mapWorkOrderToCard(dto));
        }
      } catch (err: unknown) {
        if (isMounted) {
          const msg =
            err instanceof Error ? err.message : "No se pudo cargar la orden";
          setError(msg);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceApp }]}>
      <AppHeader
        type="Detail"
        title={order ? order.folio : "Orden de trabajo"}
      />

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.brandPrimary} />
        </View>
      ) : error || !order ? (
        <View style={styles.centerContainer}>
          <Text
            style={[
              typography.bodyMd,
              styles.errorText,
              { color: colors.statusDangerFg },
            ]}
          >
            {error || "Orden no encontrada"}
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingHorizontal: layout.margin,
              paddingBottom: Platform.OS === "ios" ? 140 : 90,
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <WorkOrderDetailCard order={order} />

          <View
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
            <View style={styles.sectionHeader}>
              <Wrench size={18} color={colors.brandPrimary} />
              <Text style={[typography.buttonMd, { color: colors.textStrong }]}>
                Motivo de ingreso
              </Text>
            </View>

            <Text style={[typography.bodyMd, { color: colors.textSecondary }]}>
              {order.original.failureDescription || "Revisión preventiva"}
            </Text>
          </View>

          <View
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
            <View style={styles.sectionHeader}>
              <User size={18} color={colors.brandPrimary} />
              <Text style={[typography.buttonMd, { color: colors.textStrong }]}>
                Asesor asignado
              </Text>
            </View>

            <View style={styles.advisorRow}>
              <View
                style={[
                  styles.advisorAvatar,
                  {
                    backgroundColor: colors.surfaceAvatar,
                    borderRadius: radius.full,
                  },
                ]}
              >
                <Text
                  style={[
                    typography.captionMedium,
                    { color: colors.accentAvatarText },
                  ]}
                >
                  {order.advisorInitial}
                </Text>
              </View>

              <Text style={[typography.labelLg, { color: colors.textStrong }]}>
                {order.advisor}
              </Text>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    textAlign: "center",
  },
  scrollContent: {
    paddingTop: 16,
    gap: 16,
  },
  card: {
    padding: 16,
    borderWidth: 1,
    width: "100%",
    gap: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  advisorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  advisorAvatar: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
});
