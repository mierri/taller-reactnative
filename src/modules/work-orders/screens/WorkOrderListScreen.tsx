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
} from "@/components";
import { hasSeenOnboarding } from "@/services/onboardingStorage";
import { useTheme } from "@/theme";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Plus, SlidersHorizontal } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AddClientSheet } from "../components/AddClientSheet";
import { OrderCommandPaletteSheet } from "../components/OrderCommandPaletteSheet";
import { OrderFilterSheet } from "../components/OrderFilterSheet";
import { useWorkOrderFilters } from "../hooks/useWorkOrderFilters";
import { useWorkOrders } from "../hooks/useWorkOrders";
import { WorkOrderCategory } from "../types/work-order.types";
import { getWorkOrdersEmptyState } from "../utils/work-order-empty-state";
import { getFormattedDate } from "../utils/work-order-mapper";

export const WorkOrderListScreen: React.FC = () => {
  const { colors, typography, layout, space } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{
    orderCreated?: string;
    folio?: string;
  }>();

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSegment, setSelectedSegment] =
    useState<WorkOrderCategory>("taller");
  const [toastMessage, setToastMessage] = useState<string | null>(() =>
    params.orderCreated === "true"
      ? params.folio
        ? `Orden ${params.folio} registrada exitosamente.`
        : "Orden de trabajo registrada exitosamente."
      : null
  );
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showAddClientSheet, setShowAddClientSheet] = useState(false);

  const filters = useWorkOrderFilters();

  const {
    filteredOrders,
    availableAdvisors,
    stats,
    hasActiveFilters,
    loadSampleOrder,
    totalCount,
  } = useWorkOrders({
    selectedCategory: selectedSegment,
    searchQuery,
    filters: filters.appliedFilters,
    autoLoad: true,
  });

  useEffect(() => {
    hasSeenOnboarding().then((seen) => {
      if (!seen) setShowOnboarding(true);
    });
  }, []);

  const statsList = [
    { value: stats.countTaller, label: "En taller" },
    { value: stats.countCotizando, label: "Cotizando" },
    { value: stats.countListas, label: "Listas" },
  ];
  const segments = [
    { key: "taller", label: "En taller" },
    { key: "cotizando", label: "Cotizando", count: stats.countCotizando },
    { key: "listas", label: "Listas" },
  ];

  const fabBottom =
    Platform.OS === "ios" ? (insets.bottom > 0 ? insets.bottom + 36 : 36) : 24;

  const emptyStateProps = getWorkOrdersEmptyState({
    totalCount,
    hasActiveFilters,
    selectedCategory: selectedSegment,
    onResetFilters: () => filters.resetFilters(() => setSearchQuery("")),
    onNewOrder: () => router.push("/orders/new" as any),
  });

  const sectionTitleText =
    selectedSegment === "taller"
      ? "En el taller"
      : selectedSegment === "cotizando"
        ? "Cotizando"
        : "Listas para entrega";

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceApp }]}>
      <AppHeader
        type="Home"
        onNotificationPress={() =>
          setToastMessage("Notificaciones actualizadas al momento.")
        }
      />

      {toastMessage && (
        <Banner
          type="Success"
          layout="Floating"
          title="Listo"
          message={toastMessage}
          dismissible
          autoDismiss
          onDismiss={() => setToastMessage(null)}
        />
      )}

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingHorizontal: layout.margin,
            paddingBottom: Platform.OS === "ios" ? 175 : 105,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerTitleContainer}>
          <View style={styles.dateRow}>
            <View
              style={[styles.dateDot, { backgroundColor: colors.brandPrimary }]}
            />
            <Text style={[typography.eyebrow, { color: colors.textMuted }]}>
              {getFormattedDate()}
            </Text>
          </View>
          <Text
            style={[
              typography.headingXl,
              { color: colors.textStrong, paddingTop: space[3] },
            ]}
          >
            Órdenes de trabajo.
          </Text>
          <Text
            style={[
              typography.bodyLg,
              { color: colors.textSecondary, paddingTop: space[2] },
            ]}
          >
            Tu taller, en movimiento.
          </Text>
        </View>

        <StatSummary style={styles.statSummarySpacing} stats={statsList} />

        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onPress={() => setShowCommandPalette(true)}
          placeholder="Buscar orden, cliente o placas…"
        />

        <Segmented
          items={segments}
          selectedKey={selectedSegment}
          onChange={(key) => setSelectedSegment(key as WorkOrderCategory)}
        />

        <SectionTitle
          title={sectionTitleText}
          count={filteredOrders.length}
          rightAction={
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Filtros"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              activeOpacity={0.7}
              onPress={filters.openFilters}
              style={styles.filterBtn}
            >
              <SlidersHorizontal
                size={18}
                color={
                  hasActiveFilters ? colors.brandPrimaryText : colors.textMuted
                }
                strokeWidth={2}
              />
            </TouchableOpacity>
          }
        />

        <View style={styles.ordersList}>
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
                statusFamily={order.statusFamily}
                advisor={order.advisor}
                advisorInitial={order.advisorInitial}
                progress={order.progress}
                isLate={order.isLate}
                onPress={() =>
                  router.push({
                    pathname: "/orders/[id]",
                    params: { id: order.id },
                  })
                }
              />
            ))
          ) : (
            <EmptyState {...emptyStateProps} />
          )}
        </View>
      </ScrollView>

      <View
        pointerEvents="box-none"
        style={[styles.fabPosition, { bottom: fabBottom }]}
      >
        <Button
          type="FAB"
          floating={false}
          label="Nueva Orden"
          iconLeading={<Plus size={18} color="#ffffff" strokeWidth={2.4} />}
          onPress={() => router.push("/orders/new" as any)}
        />
      </View>

      <OnboardingModal
        visible={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={(withExamples) => {
          setShowOnboarding(false);
          if (withExamples) loadSampleOrder();
        }}
      />

      <OrderFilterSheet
        visible={filters.isFilterOpen}
        onClose={filters.closeFilters}
        advisors={availableAdvisors}
        selectedAdvisor={filters.draft.advisor}
        onSelectAdvisor={filters.draft.setAdvisor}
        selectedStatus={filters.draft.status}
        onSelectStatus={filters.draft.setStatus}
        onlyDelayed={filters.draft.onlyDelayed}
        onToggleOnlyDelayed={filters.draft.setOnlyDelayed}
        includeClosed={filters.draft.includeClosed}
        onToggleIncludeClosed={filters.draft.setIncludeClosed}
        onApply={filters.applyFilters}
        onReset={() => filters.resetFilters(() => setSearchQuery(""))}
      />

      <OrderCommandPaletteSheet
        visible={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        orders={filteredOrders}
        onSelectOrder={(id) =>
          router.push({ pathname: "/orders/[id]", params: { id } })
        }
        onReceiveVehicle={() => router.push("/orders/new" as any)}
        onNewClient={() => setShowAddClientSheet(true)}
        onRegisterPayment={() =>
          setToastMessage("Módulo de caja disponible próximamente.")
        }
        onConsultParts={() =>
          setToastMessage("Catálogo de refacciones disponible próximamente.")
        }
      />

      <AddClientSheet
        visible={showAddClientSheet}
        onClose={() => setShowAddClientSheet(false)}
        onClientCreated={(client) =>
          setToastMessage(`Cliente ${client.name} registrado con éxito.`)
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingTop: 20 },
  headerTitleContainer: { gap: 4 },
  dateRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  dateDot: { width: 6, height: 6, borderRadius: 3 },
  statSummarySpacing: { marginTop: 20, marginBottom: 16 },
  filterBtn: { width: 48, height: 48, alignItems: "center", justifyContent: "center" },
  ordersList: { gap: 12 },
  fabPosition: { position: "absolute", right: 24, zIndex: 9999 },
});
