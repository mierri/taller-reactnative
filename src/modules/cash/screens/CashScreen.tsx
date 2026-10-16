import { AppHeader, Banner, BannerType } from "@/components";
import {
  AdvancePaymentMethod,
  AdvanceSuccessModal,
  formatCurrency,
  PaymentFormSheet,
} from "@/modules/work-orders";
import { useTheme } from "@/theme";
import { useFocusEffect, useRouter } from "expo-router";
import {
  ArrowRight,
  ClipboardList,
  Plus,
  Wallet,
} from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  CashCutSheet,
  CashMovementCard,
  CashSummaryCard,
  SelectOrderToChargeSheet,
} from "../components";
import {
  addMockCashMovement,
  getChargeableOrders,
  getMockCashMovements,
} from "../mocks/cash.mock";
import { CashMovementItem, ChargeableOrderItem } from "../types/cash.types";

export const CashScreen: React.FC = () => {
  const { colors, typography, layout, radius, shadows, space } = useTheme();
  const router = useRouter();

  const [movements, setMovements] = useState<CashMovementItem[]>(() =>
    getMockCashMovements(),
  );

  useFocusEffect(
    useCallback(() => {
      setMovements(getMockCashMovements());
    }, []),
  );
  const [onlyCash, setOnlyCash] = useState(false);
  const [showSelectOrderSheet, setShowSelectOrderSheet] = useState(false);
  const [selectedOrder, setSelectedOrder] =
    useState<ChargeableOrderItem | null>(null);
  const [showPaymentSheet, setShowPaymentSheet] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCashCutSheet, setShowCashCutSheet] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: BannerType;
  } | null>(null);

  const chargeableOrders = getChargeableOrders();

  const grossTotal = movements.reduce((sum, item) => sum + item.amount, 0);
  const commissionsTotal = movements.reduce(
    (sum, item) => sum + item.commissionAmount,
    0,
  );
  const netTotal = movements.reduce((sum, item) => sum + item.netAmount, 0);

  const expectedCash = movements
    .filter((item) => item.paymentMethod === "CASH")
    .reduce((sum, item) => sum + item.netAmount, 0);

  const visibleMovements = onlyCash
    ? movements.filter((item) => item.paymentMethod === "CASH")
    : movements;

  const handleSelectOrder = (order: ChargeableOrderItem) => {
    setSelectedOrder(order);
    setShowSelectOrderSheet(false);
    setShowPaymentSheet(true);
  };

  const handleSavePayment = (
    amount: number,
    method: AdvancePaymentMethod,
    commissionPercent: number,
    netAmount: number,
  ) => {
    if (!selectedOrder) return;
    const commissionAmount = Math.max(0, amount - netAmount);
    addMockCashMovement({
      workOrderId: selectedOrder.id,
      workOrderCode: selectedOrder.folio,
      clientName: selectedOrder.clientName,
      paymentMethod: method,
      amount,
      commissionAmount,
      netAmount,
      type: "INCOME",
    });
    setMovements(getMockCashMovements());
    setShowPaymentSheet(false);
    setShowSuccessModal(true);
  };

  const handleSaveCashCut = (countedCash: number) => {
    const diff = countedCash - expectedCash;
    const msg =
      Math.abs(diff) < 0.01
        ? `Corte de caja guardado sin diferencias (${formatCurrency(countedCash)}).`
        : `Corte de caja guardado con ${formatCurrency(countedCash)} contados.`;
    setToast({ message: msg, type: "Success" });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceApp }]}>
      <AppHeader
        type="Home"
        onNotificationPress={() =>
          setToast({
            message: "Notificaciones actualizadas al momento.",
            type: "Info",
          })
        }
      />

      {toast && (
        <Banner
          type={toast.type}
          layout="Floating"
          title={toast.type === "Success" ? "Listo" : undefined}
          message={toast.message}
          dismissible
          autoDismiss
          onDismiss={() => setToast(null)}
        />
      )}

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingHorizontal: layout.margin,
            paddingBottom: Platform.OS === "ios" ? 140 : 95,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <Text style={[typography.eyebrow, { color: colors.textMuted }]}>
            EL DINERO, EN ORDEN
          </Text>
          <Text
            style={[
              typography.headingXl,
              { color: colors.textStrong, paddingTop: space[3] },
            ]}
          >
            Caja del taller
            <Text style={{ color: colors.brandPrimary }}>.</Text>
          </Text>
          <Text
            style={[
              typography.bodyLg,
              { color: colors.textSecondary, paddingTop: space[2] },
            ]}
          >
            Cobros claros. Un cierre tranquilo.
          </Text>
        </View>

        <CashSummaryCard
          grossTotal={grossTotal}
          commissionsTotal={commissionsTotal}
          netTotal={netTotal}
        />

        <View style={styles.actionsRow}>
          <TouchableOpacity
            onPress={() => setShowSelectOrderSheet(true)}
            activeOpacity={0.85}
            style={[
              styles.primaryActionBtn,
              {
                backgroundColor: colors.brandPrimary,
                borderRadius: radius.xl,
              },
            ]}
          >
            <Plus size={18} color={colors.textOnBrand} strokeWidth={2.4} />
            <Text style={[typography.buttonMd, { color: colors.textOnBrand }]}>
              Registrar cobro
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowCashCutSheet(true)}
            activeOpacity={0.8}
            style={[
              styles.secondaryActionBtn,
              {
                backgroundColor: colors.surfaceCard,
                borderColor: colors.borderCard,
                borderRadius: radius.xl,
              },
              shadows.card,
            ]}
          >
            <Wallet size={18} color={colors.brandPrimary} strokeWidth={2.2} />
            <Text style={[typography.buttonMd, { color: colors.brandPrimary }]}>
              Corte de caja
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/finance" as any)}
          activeOpacity={0.75}
          style={styles.financeLinkRow}
        >
          <Text
            style={[typography.labelMd, { color: colors.brandPrimaryText }]}
          >
            Ver cuentas, gastos y reportes
          </Text>
          <ArrowRight
            size={16}
            color={colors.brandPrimaryText}
            strokeWidth={2.2}
          />
        </TouchableOpacity>

        <View style={styles.movementsSection}>
          <View style={styles.movementsHeader}>
            <Text style={[typography.eyebrow, { color: colors.textMuted }]}>
              MOVIMIENTOS
            </Text>
            <TouchableOpacity
              onPress={() => setOnlyCash((prev) => !prev)}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text
                style={[
                  typography.captionMedium,
                  {
                    color: onlyCash
                      ? colors.brandPrimaryText
                      : colors.textMuted,
                  },
                ]}
              >
                Solo efectivo
              </Text>
            </TouchableOpacity>
          </View>

          {visibleMovements.length === 0 ? (
            <View
              style={[
                styles.emptyCard,
                {
                  backgroundColor: colors.surfaceTile,
                  borderColor: colors.borderDashed,
                  borderRadius: radius.xl,
                },
              ]}
            >
              <ClipboardList
                size={28}
                color={colors.textMuted}
                strokeWidth={1.8}
              />
              <Text
                style={[
                  typography.titleCard,
                  styles.emptyTitle,
                  { color: colors.textStrong },
                ]}
              >
                Tu caja está al día
              </Text>
              <Text
                style={[
                  typography.bodyMd,
                  styles.emptyDescription,
                  { color: colors.textSecondary },
                ]}
              >
                Los cobros y anticipos aparecerán aquí después de registrarlos.
              </Text>
            </View>
          ) : (
            <View style={styles.movementsList}>
              {visibleMovements.map((item) => (
                <CashMovementCard key={item.id} movement={item} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <SelectOrderToChargeSheet
        visible={showSelectOrderSheet}
        onClose={() => setShowSelectOrderSheet(false)}
        orders={chargeableOrders}
        onSelectOrder={handleSelectOrder}
      />

      <PaymentFormSheet
        visible={showPaymentSheet}
        onClose={() => setShowPaymentSheet(false)}
        title={
          selectedOrder?.isCommercialClosed
            ? "Cobrar orden"
            : "Registrar anticipo"
        }
        orderFolio={selectedOrder?.folio}
        vehicleName={selectedOrder?.vehicleName}
        badgeText={
          selectedOrder?.isCommercialClosed &&
          selectedOrder.pendingBalance !== undefined
            ? formatCurrency(selectedOrder.pendingBalance)
            : "Anticipo"
        }
        initialAmount={selectedOrder?.pendingBalance}
        submitLabel={
          selectedOrder?.isCommercialClosed
            ? "Registrar cobro y liquidar"
            : "Registrar cobro →"
        }
        onSave={handleSavePayment}
      />

      <AdvanceSuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />

      <CashCutSheet
        visible={showCashCutSheet}
        onClose={() => setShowCashCutSheet(false)}
        expectedCash={expectedCash}
        onSaveCut={handleSaveCashCut}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
    gap: 18,
  },
  headerSection: {
    gap: 2,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
  },
  primaryActionBtn: {
    flex: 1,
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  secondaryActionBtn: {
    flex: 1,
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    gap: 8,
  },
  financeLinkRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 4,
  },
  movementsSection: {
    gap: 12,
    marginTop: 6,
  },
  movementsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  emptyCard: {
    borderWidth: 1,
    borderStyle: "dashed",
    paddingVertical: 34,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  emptyTitle: {
    textAlign: "center",
    marginTop: 2,
  },
  emptyDescription: {
    textAlign: "center",
    maxWidth: 280,
  },
  movementsList: {
    gap: 12,
  },
});
