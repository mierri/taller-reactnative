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
import { useRouter } from "expo-router";
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
import { OrderFilterSheet } from "../components/OrderFilterSheet";
import { useWorkOrderFilters } from "../hooks/useWorkOrderFilters";
import { useWorkOrders } from "../hooks/useWorkOrders";
import { WorkOrderCategory } from "../types/work-order.types";
import { getWorkOrdersEmptyState } from "../utils/work-order-empty-state";
import { getFormattedDate } from "../utils/work-order-mapper";

export const WorkOrderListScreen: React.FC = () => {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSegment, setSelectedSegment] =
    useState<WorkOrderCategory>("taller");
  const [showFloatingToast, setShowFloatingToast] = useState(false);

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
    autoLoad: false,
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
    Platform.OS === "ios" ? (insets.bottom > 0 ? insets.bottom + 36 : 36) : 20;

  const emptyStateProps = getWorkOrdersEmptyState({
    totalCount,
    hasActiveFilters,
    selectedCategory: selectedSegment,
    onResetFilters: () => filters.resetFilters(() => setSearchQuery("")),
    onLoadSample: () => {
      loadSampleOrder();
      setShowFloatingToast(true);
    },
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
            paddingTop: spacing[5],
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

        <StatSummary style={{ marginTop: 20 }} stats={statsList} />

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
          title={sectionTitleText}
          count={filteredOrders.length}
          countSingular="orden"
          countPlural="órdenes"
          rightAction={
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Filtros"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              activeOpacity={0.7}
              onPress={filters.openFilters}
            >
              <SlidersHorizontal
                size={16}
                color={
                  hasActiveFilters ? colors.brandPrimary : colors.textSecondary
                }
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
      </ScrollView>

      <View
        pointerEvents="box-none"
        style={[styles.fabPosition, { bottom: fabBottom }]}
      >
        <Button
          type="FAB"
          floating={false}
          label="Recibir auto"
          iconLeading={<Plus size={18} color="#ffffff" strokeWidth={2.4} />}
          onPress={() => {
            if (filteredOrders.length === 0 && totalCount === 0) {
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
    </View>
  );
};

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
    flexDirection: "row",
    alignItems: "center",
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
    fontWeight: "600",
    letterSpacing: 1.5,
  },
  screenTitle: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: "700",
    letterSpacing: -0.3,
    paddingTop: 12,
  },
  screenSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "400",
    paddingTop: 8,
  },
  fabPosition: {
    position: "absolute",
    right: 20,
    zIndex: 9999,
    elevation: 8,
  },
});
