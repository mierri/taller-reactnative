import { AppHeader } from '@/components';
import { useTheme } from '@/theme';
import { User, Wrench } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { WorkOrderDetailCard } from '../components/WorkOrderDetailCard';
import { fetchWorkOrderById } from '../services/work-orders.service';
import { WorkOrderCardModel, WorkOrderDto } from '../types/work-order.types';
import { mapWorkOrderToCard } from '../utils/work-order-mapper';

export interface WorkOrderDetailScreenProps {
  id: string;
}

export const WorkOrderDetailScreen: React.FC<WorkOrderDetailScreenProps> = ({
  id,
}) => {
  const { colors, spacing, radii, shadows } = useTheme();
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
            err instanceof Error ? err.message : 'No se pudo cargar la orden';
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
        title={order ? order.folio : 'Orden de trabajo'}
      />

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.brandPrimary} />
        </View>
      ) : error || !order ? (
        <View style={styles.centerContainer}>
          <Text style={[styles.errorText, { color: colors.statusDangerFg }]}>
            {error || 'Orden no encontrada'}
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingHorizontal: spacing[5],
              paddingTop: spacing[4],
              paddingBottom: Platform.OS === 'ios' ? 140 : 90,
              gap: spacing[4],
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
                borderRadius: radii.card,
              },
              shadows.card,
            ]}
          >
            <View style={styles.sectionHeader}>
              <Wrench size={18} color={colors.brandPrimary} />
              <Text style={[styles.sectionTitle, { color: colors.textStrong }]}>
                Motivo de ingreso
              </Text>
            </View>

            <Text
              style={[
                styles.descriptionText,
                { color: colors.textSecondary },
              ]}
            >
              {order.original.failureDescription || 'Revisión preventiva'}
            </Text>
          </View>

          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.surfaceCard,
                borderColor: colors.borderCard,
                borderRadius: radii.card,
              },
              shadows.card,
            ]}
          >
            <View style={styles.sectionHeader}>
              <User size={18} color={colors.brandPrimary} />
              <Text style={[styles.sectionTitle, { color: colors.textStrong }]}>
                Asesor asignado
              </Text>
            </View>

            <View style={styles.advisorRow}>
              <View
                style={[
                  styles.advisorAvatar,
                  { backgroundColor: colors.surfaceAvatar },
                ]}
              >
                <Text
                  style={[
                    styles.advisorInitialText,
                    { color: colors.accentAvatarText },
                  ]}
                >
                  {order.advisorInitial}
                </Text>
              </View>

              <Text style={[styles.advisorName, { color: colors.textStrong }]}>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
  scrollContent: {
    paddingTop: 8,
  },
  card: {
    padding: 18,
    borderWidth: 1.2,
    width: '100%',
    gap: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  descriptionText: {
    fontSize: 13,
    lineHeight: 20,
  },
  advisorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  advisorAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  advisorInitialText: {
    fontSize: 11,
    fontWeight: '700',
  },
  advisorName: {
    fontSize: 13,
    fontWeight: '600',
  },
});
