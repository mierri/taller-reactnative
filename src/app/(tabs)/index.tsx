import {
  AppHeader,
  Banner,
  Button,
  EmptyState,
  OnboardingModal,
  OrderCard,
  SearchBar,
  SectionTitle,
  Segmented,
  StatSummary,
} from '@/components';
import {
  useWorkOrders,
  WorkOrderCategory,
} from '@/modules/work-orders';
import { hasSeenOnboarding } from '@/services/onboardingStorage';
import { useTheme } from '@/theme';
import { Plus, SlidersHorizontal } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DAYS_ES = [
  'DOMINGO',
  'LUNES',
  'MARTES',
  'MIÉRCOLES',
  'JUEVES',
  'VIERNES',
  'SÁBADO',
];

const MONTHS_ES = [
  'ENERO',
  'FEBRERO',
  'MARZO',
  'ABRIL',
  'MAYO',
  'JUNIO',
  'JULIO',
  'AGOSTO',
  'SEPTIEMBRE',
  'OCTUBRE',
  'NOVIEMBRE',
  'DICIEMBRE',
];

function getFormattedDate(): string {
  const now = new Date();
  const dayName = DAYS_ES[now.getDay()];
  const dayNumber = now.getDate();
  const monthName = MONTHS_ES[now.getMonth()];
  return `${dayName}, ${dayNumber} DE ${monthName}`;
}

export default function HomeScreen() {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSegment, setSelectedSegment] = useState<WorkOrderCategory>('taller');
  const [showFloatingToast, setShowFloatingToast] = useState(false);

  const {
    filteredOrders,
    stats,
    loadSampleOrder,
  } = useWorkOrders({
    selectedCategory: selectedSegment,
    searchQuery,
    autoLoad: false,
  });

  useEffect(() => {
    hasSeenOnboarding().then((seen) => {
      if (!seen) {
        setShowOnboarding(true);
      }
    });
  }, []);

  const statsList = [
    { value: stats.countTaller, label: 'En taller' },
    { value: stats.countCotizando, label: 'Cotizando' },
    { value: stats.countListas, label: 'Listas' },
  ];

  const segments = [
    { key: 'taller', label: 'En taller' },
    { key: 'cotizando', label: 'Cotizando', count: stats.countCotizando },
    { key: 'listas', label: 'Listas' },
  ];

  const fabBottom =
    Platform.OS === 'ios'
      ? (insets.bottom > 0 ? insets.bottom + 49 + 16 : 49 + 16)
      : 20;

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceApp }]}>
      <AppHeader
        type="Home"
        onNotificationPress={() => setShowFloatingToast(true)}
      />

      {showFloatingToast && (
        <Banner
          type="Success"
          layout="Floating"
          title="Listo"
          message="OT-1049 registrada y lista para el diagnóstico."
          dismissible
          onDismiss={() => setShowFloatingToast(false)}
        />
      )}

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingHorizontal: spacing[5],
            paddingTop: spacing[3],
            paddingBottom: Platform.OS === 'ios' ? 175 : 105,
            gap: spacing[4],
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerTitleContainer}>
          <View style={styles.dateRow}>
            <View
              style={[
                styles.dateDot,
                { backgroundColor: colors.brandPrimary },
              ]}
            />
            <Text style={[styles.dateEyebrow, { color: colors.textSecondary }]}>
              {getFormattedDate()}
            </Text>
          </View>

          <Text style={[styles.screenTitle, { color: colors.textStrong }]}>
            Órdenes de trabajo.
          </Text>

          <Text
            style={[styles.screenSubtitle, { color: colors.textSecondary }]}
          >
            Tu taller, en movimiento.
          </Text>
        </View>

        <StatSummary stats={statsList} />

        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Buscar orden, cliente o placas…"
        />

        <Segmented
          items={segments}
          selectedKey={selectedSegment}
          onChange={(key) => setSelectedSegment(key as WorkOrderCategory)}
        />

        <SectionTitle
          title={
            selectedSegment === 'taller'
              ? 'En el taller'
              : selectedSegment === 'cotizando'
                ? 'Cotizando'
                : 'Listas para entrega'
          }
          count={filteredOrders.length}
          countSingular="orden"
          countPlural="órdenes"
          rightAction={
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Filtros"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              activeOpacity={0.7}
            >
              <SlidersHorizontal
                size={16}
                color={colors.textSecondary}
                strokeWidth={2}
              />
            </TouchableOpacity>
          }
        />

        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              folio={order.folio}
              deadline={order.deadline}
              vehicle={order.vehicle}
              plate={order.plate}
              client={order.client}
              status={order.status}
              statusType={order.statusType}
              advisor={order.advisor}
              advisorInitial={order.advisorInitial}
              progress={order.progress}
              isLate={order.isLate}
              onPress={() => setShowOnboarding(true)}
            />
          ))
        ) : (
          <EmptyState
            title="Tu primer vehículo empieza aquí"
            description="Toca Recibir auto para registrar al cliente y comenzar el diagnóstico."
            actionLabel="Recibir mi primer auto"
            actionButtonType="Secondary"
            onActionPress={() => {
              loadSampleOrder();
              setShowFloatingToast(true);
            }}
          />
        )}
      </ScrollView>

      <View
        pointerEvents="box-none"
        style={[
          styles.fabPosition,
          {
            bottom: fabBottom,
          },
        ]}
      >
        <Button
          type="FAB"
          floating={false}
          label="Recibir auto"
          iconLeading={<Plus size={18} color="#ffffff" strokeWidth={2.4} />}
          onPress={() => {
            if (filteredOrders.length === 0) {
              loadSampleOrder();
              setShowFloatingToast(true);
            } else {
              setShowOnboarding(true);
            }
          }}
        />
      </View>

      <OnboardingModal
        visible={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={(withExamples) => {
          setShowOnboarding(false);
          if (withExamples) {
            loadSampleOrder();
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 8,
  },
  headerTitleContainer: {
    gap: 4,
    paddingTop: 4,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  dateEyebrow: {
    fontSize: 10,
    lineHeight: 15,
    fontWeight: '600',
    letterSpacing: 1.5,
  },
  screenTitle: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  screenSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
  },
  fabPosition: {
    position: 'absolute',
    right: 20,
    zIndex: 9999,
    elevation: 8,
  },
});
