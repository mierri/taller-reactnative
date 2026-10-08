import { Badge, PlateChip } from '@/components';
import { useTheme } from '@/theme';
import { CarFront, Clock } from 'lucide-react-native';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { WorkOrderCardModel } from '../types/work-order.types';

export interface WorkOrderDetailCardProps {
  order: WorkOrderCardModel;
}

export const WorkOrderDetailCard: React.FC<WorkOrderDetailCardProps> = ({
  order,
}) => {
  const { colors, radii, shadows } = useTheme();
  const totalSteps = 6;
  const currentStep = order.progress;

  return (
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
      <View style={styles.topRow}>
        <View style={styles.folioGroup}>
          <Text
            style={[
              styles.folio,
              {
                color: colors.textMuted,
                fontFamily: Platform.select({
                  ios: 'Menlo',
                  android: 'monospace',
                  default: 'monospace',
                }),
              },
            ]}
          >
            {order.folio}
          </Text>
          <View style={styles.badgeRow}>
            <Badge label={order.status} status={order.statusType} />
            {order.isLate && <Badge label="RETRASADA" status="late" />}
          </View>
        </View>

        <View style={styles.dateGroup}>
          <Clock size={14} color={colors.textMuted} />
          <Text style={[styles.deadline, { color: colors.textMuted }]}>
            {order.deadline}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.vehicleRow}>
        <View
          style={[
            styles.iconTile,
            { backgroundColor: colors.surfaceTile },
          ]}
        >
          <CarFront size={24} color={colors.brandPrimary} />
        </View>

        <View style={styles.vehicleInfo}>
          <Text style={[styles.vehicleTitle, { color: colors.textStrong }]}>
            {order.vehicle}
          </Text>
          <View style={styles.metaRow}>
            <PlateChip plate={order.plate} />
            <Text style={[styles.clientText, { color: colors.textSecondary }]}>
              {order.client}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={[styles.progressLabel, { color: colors.textLabel }]}>
            AVANCE OPERATIVO ({currentStep} DE {totalSteps})
          </Text>
        </View>

        <View style={styles.progressRow}>
          {Array.from({ length: totalSteps }).map((_, i) => {
            const isDone = i < currentStep;
            return (
              <View
                key={i}
                style={[
                  styles.progressSegment,
                  {
                    backgroundColor: isDone
                      ? colors.progressDone
                      : colors.progressOff,
                  },
                ]}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 18,
    borderWidth: 1.2,
    width: '100%',
    gap: 14,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  folioGroup: {
    gap: 6,
  },
  folio: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  deadline: {
    fontSize: 11,
    lineHeight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.06)',
    width: '100%',
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconTile: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleInfo: {
    flex: 1,
    gap: 4,
  },
  vehicleTitle: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  clientText: {
    fontSize: 13,
    lineHeight: 18,
  },
  progressContainer: {
    gap: 8,
    marginTop: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 10,
    lineHeight: 15,
    fontWeight: '600',
    letterSpacing: 1.2,
  },
  progressRow: {
    flexDirection: 'row',
    gap: 6,
    width: '100%',
  },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
});

