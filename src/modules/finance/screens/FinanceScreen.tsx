import { AppHeader, Banner, BannerType } from "@/components";
import { useTheme } from "@/theme";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ManualMovementSheet,
  MovementsTab,
  PayablesTab,
  PaySupplierSheet,
  ReceivablesTab,
  ReportTab,
  SupplierAccountSheet,
} from "../components";
import {
  addMockManualMovement,
  addMockPayable,
  applyPaymentToPayable,
  getMockFinancialReport,
  getMockManualMovements,
  getMockPayables,
  getMockReceivables,
  getMockSuppliers,
} from "../mocks/finance.mock";
import {
  AccountPayableItem,
  AccountReceivableItem,
  FinanceTabKey,
  ManualMovementItem,
} from "../types/finance.types";

const tabsList: { key: FinanceTabKey; label: string }[] = [
  { key: "receivables", label: "Por cobrar" },
  { key: "payables", label: "Por pagar" },
  { key: "movements", label: "Movimientos" },
  { key: "report", label: "Reporte" },
];

export const FinanceScreen: React.FC = () => {
  const { colors, typography, layout, radius, space, shadows } = useTheme();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<FinanceTabKey>("receivables");
  const [includePaid, setIncludePaid] = useState(false);

  const [receivables, setReceivables] = useState<AccountReceivableItem[]>(() =>
    getMockReceivables(false),
  );
  const [payables, setPayables] = useState<AccountPayableItem[]>(() =>
    getMockPayables(),
  );
  const [movements, setMovements] = useState<ManualMovementItem[]>(() =>
    getMockManualMovements(),
  );

  const [showSupplierAccountSheet, setShowSupplierAccountSheet] = useState(false);
  const [selectedPayable, setSelectedPayable] = useState<AccountPayableItem | null>(null);
  const [showPaySupplierSheet, setShowPaySupplierSheet] = useState(false);
  const [showManualMovementSheet, setShowManualMovementSheet] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: BannerType } | null>(null);

  const [reportFromDate, setReportFromDate] = useState<Date>(() => new Date(2026, 9, 1));
  const [reportToDate, setReportToDate] = useState<Date>(() => new Date(2026, 9, 16));

  const financialReport = useMemo(
    () => getMockFinancialReport(reportFromDate, reportToDate),
    [reportFromDate, reportToDate],
  );

  const reloadData = useCallback(() => {
    setReceivables(getMockReceivables(includePaid));
    setPayables(getMockPayables());
    setMovements(getMockManualMovements());
  }, [includePaid]);

  useFocusEffect(
    useCallback(() => {
      reloadData();
    }, [reloadData]),
  );

  const handleToggleIncludePaid = (val: boolean) => {
    setIncludePaid(val);
    setReceivables(getMockReceivables(val));
  };

  const handleSaveSupplierAccount = (
    data: Omit<
      AccountPayableItem,
      "id" | "paidAmount" | "balance" | "status" | "createdAt"
    >,
  ) => {
    addMockPayable(data);
    setPayables(getMockPayables());
    setShowSupplierAccountSheet(false);
    setToast({
      message: "Cuenta de proveedor registrada exitosamente.",
      type: "Success",
    });
  };

  const handleOpenPayToSupplier = (item: AccountPayableItem) => {
    setSelectedPayable(item);
    setShowPaySupplierSheet(true);
  };

  const handleConfirmPaySupplier = (
    payableId: string,
    amount: number,
    method: "CASH" | "TRANSFER" | "CARD",
  ) => {
    applyPaymentToPayable(payableId, amount, method);
    setPayables(getMockPayables());
    setShowPaySupplierSheet(false);
    setSelectedPayable(null);
    setToast({
      message: `Pago registrado correctamente (${method === "CASH" ? "Efectivo" : method === "TRANSFER" ? "Transferencia" : "Tarjeta"}).`,
      type: "Success",
    });
  };

  const handleSaveManualMovement = (
    data: Omit<ManualMovementItem, "id">,
  ) => {
    addMockManualMovement(data);
    setMovements(getMockManualMovements());
    setShowManualMovementSheet(false);
    setToast({
      message: `${data.type === "INCOME" ? "Ingreso" : "Gasto"} registrado exitosamente.`,
      type: "Success",
    });
  };

  const suppliers = getMockSuppliers();

  return (
    <View style={[styles.screen, { backgroundColor: colors.surfaceApp }]}>
      <AppHeader type="Home" />

      {toast && (
        <Banner
          message={toast.message}
          type={toast.type}
          layout="Floating"
          onDismiss={() => setToast(null)}
        />
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          {
            paddingHorizontal: layout.margin,
            paddingBottom: Platform.OS === "ios" ? 170 : 120,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerBlock}>
          <Text style={[typography.eyebrow, { color: colors.textMuted }]}>
            CUENTAS CLARAS
          </Text>
          <Text style={[typography.headingXl, { color: colors.textStrong }]}>
            Finanzas.
          </Text>
          <Text style={[typography.bodyMd, { color: colors.textSecondary }]}>
            Lo que te deben, lo que debes y cómo va el taller.
          </Text>
        </View>

        <View
          style={[
            styles.segmentedBar,
            {
              backgroundColor: colors.surfaceTile,
              borderRadius: radius.lg,
            },
          ]}
        >
          {tabsList.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                activeOpacity={0.8}
                style={[
                  styles.tabItem,
                  isActive && [
                    styles.tabItemActive,
                    {
                      backgroundColor: colors.surfaceCard,
                      borderRadius: radius.md,
                    },
                    shadows.card,
                  ],
                ]}
              >
                <Text
                  style={[
                    typography.captionMedium,
                    {
                      color: isActive
                        ? colors.brandPrimary
                        : colors.textSecondary,
                    },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {activeTab === "receivables" && (
          <ReceivablesTab
            receivables={receivables}
            includePaid={includePaid}
            onToggleIncludePaid={handleToggleIncludePaid}
            onSelectReceivable={(item) =>
              router.push({
                pathname: "/(tabs)/orders/[id]",
                params: { id: item.workOrderId },
              } as any)
            }
          />
        )}

        {activeTab === "payables" && (
          <PayablesTab
            payables={payables}
            onOpenNewPayable={() => setShowSupplierAccountSheet(true)}
            onPayToSupplier={handleOpenPayToSupplier}
          />
        )}

        {activeTab === "movements" && (
          <MovementsTab
            movements={movements}
            onOpenNewMovement={() => setShowManualMovementSheet(true)}
          />
        )}

        {activeTab === "report" && (
          <ReportTab
            report={financialReport}
            fromDate={reportFromDate}
            toDate={reportToDate}
            onSelectFromDate={setReportFromDate}
            onSelectToDate={setReportToDate}
          />
        )}
      </ScrollView>

      <SupplierAccountSheet
        visible={showSupplierAccountSheet}
        onClose={() => setShowSupplierAccountSheet(false)}
        suppliers={suppliers}
        onSaveAccount={handleSaveSupplierAccount}
      />

      <PaySupplierSheet
        visible={showPaySupplierSheet}
        onClose={() => {
          setShowPaySupplierSheet(false);
          setSelectedPayable(null);
        }}
        payable={selectedPayable}
        onConfirmPay={handleConfirmPaySupplier}
      />

      <ManualMovementSheet
        visible={showManualMovementSheet}
        onClose={() => setShowManualMovementSheet(false)}
        onSaveMovement={handleSaveManualMovement}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scrollView: { flex: 1 },
  contentContainer: { paddingTop: 16, gap: 20 },
  headerBlock: { gap: 4 },
  segmentedBar: { flexDirection: "row", padding: 4, alignItems: "center" },
  tabItem: { flex: 1, paddingVertical: 10, alignItems: "center", justifyContent: "center" },
  tabItemActive: { elevation: 2 },
});
