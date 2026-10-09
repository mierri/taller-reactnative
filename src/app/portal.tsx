import { useTheme } from "@/theme";
import { useLocalSearchParams } from "expo-router";
import { Car, Check, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface PortalConcept {
  id: string;
  concept: string;
  price: number;
}

const DEFAULT_ITEMS: PortalConcept[] = [
  { id: "1", concept: "Cambio de aceite y filtro sintético", price: 2000 },
  { id: "2", concept: "Balatas delanteras semimetálicas", price: 850 },
  { id: "3", concept: "Alineación y balanceo computarizado", price: 650 },
];

export default function ClientPortalScreen() {
  const { colors, typography, radius } = useTheme();
  const params = useLocalSearchParams<{ folio?: string; client?: string; car?: string; plate?: string }>();

  const orderFolio = params.folio || "OT-1049";
  const clientName = params.client || "Mafer";
  const vehicleName = params.car || "Nissan Versa";
  const plate = params.plate || "PXM-482-B";

  const [decisions, setDecisions] = useState<Record<string, boolean>>({
    "1": true,
  });

  const handleDecision = (id: string, approved: boolean) => {
    setDecisions((prev) => ({ ...prev, [id]: approved }));
  };

  const authorizedItems = DEFAULT_ITEMS.filter((item) => decisions[item.id] === true);
  const authorizedSubtotal = authorizedItems.reduce((acc, curr) => acc + curr.price, 0);
  const authorizedIva = authorizedSubtotal * 0.16;
  const authorizedTotal = authorizedSubtotal + authorizedIva;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.surfaceApp }]}>
      <View style={[styles.topHeader, { borderBottomColor: colors.borderDivider }]}>
        <Text style={[styles.brandTitle, { color: colors.textStrong }]}>pitstop.</Text>
        <Text style={[typography.captionMedium, { color: colors.brandPrimary, fontWeight: "700" }]}>
          Portal del cliente
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.contentWrapper}>
          <Text style={[typography.eyebrow, { color: colors.textMuted }]}>
            TU VEHÍCULO · {orderFolio}
          </Text>

          <Text style={[typography.headingXl, styles.clientGreeting, { color: colors.textStrong }]}>
            Hola, {clientName}.
          </Text>

          <Text style={[typography.bodyMd, styles.clientSubtitle, { color: colors.textSecondary }]}>
            Tú decides qué trabajos autorizas. Puedes aceptar solo los que necesites.
          </Text>

          <View style={[styles.vehicleCard, { backgroundColor: colors.surfaceCard, borderColor: colors.borderCard, borderRadius: radius.xl }]}>
            <View style={styles.vehicleCardLeft}>
              <Car size={26} color={colors.textSecondary} />
              <View>
                <Text style={[typography.titleCard, { color: colors.textStrong }]}>{vehicleName}</Text>
                <Text style={[typography.caption, { color: colors.textMuted }]}>{plate}</Text>
              </View>
            </View>
            <View style={[styles.statusPill, { backgroundColor: colors.statusWarningBg, borderColor: colors.statusWarningBorder, borderRadius: radius.full }]}>
              <Text style={[typography.captionMedium, { color: colors.statusWarningFg, fontWeight: "700", fontSize: 11 }]}>
                • Por aprobar
              </Text>
            </View>
          </View>

          <View style={styles.itemsContainer}>
            {DEFAULT_ITEMS.map((item) => {
              const isApproved = decisions[item.id] === true;
              const isRejected = decisions[item.id] === false;

              return (
                <View
                  key={item.id}
                  style={[
                    styles.itemCard,
                    { backgroundColor: colors.surfaceCard, borderColor: colors.borderCard, borderRadius: radius.xl },
                  ]}
                >
                  <Text style={[typography.titleCard, styles.itemTitle, { color: colors.textStrong }]}>
                    {item.concept}
                  </Text>

                  <Text style={[typography.headingMd, styles.itemPrice, { color: colors.brandPrimary }]}>
                    ${item.price.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                  </Text>

                  <View style={styles.decisionRow}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => handleDecision(item.id, true)}
                      style={[
                        styles.decisionBtn,
                        {
                          backgroundColor: isApproved ? colors.statusActiveBg : colors.surfaceCard,
                          borderColor: isApproved ? colors.statusActiveBorder : colors.borderButton,
                          borderRadius: radius.lg,
                        },
                      ]}
                    >
                      <Check size={16} color={isApproved ? colors.statusActiveFg : colors.brandPrimary} strokeWidth={2.4} />
                      <Text
                        style={[
                          typography.buttonMd,
                          styles.decisionText,
                          { color: isApproved ? colors.statusActiveFg : colors.brandPrimary },
                        ]}
                      >
                        Autorizar
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => handleDecision(item.id, false)}
                      style={[
                        styles.decisionBtn,
                        {
                          backgroundColor: isRejected ? colors.statusDangerBg : colors.surfaceCard,
                          borderColor: isRejected ? colors.statusDangerBorder : colors.borderButton,
                          borderRadius: radius.lg,
                        },
                      ]}
                    >
                      <X size={16} color={isRejected ? colors.statusDangerFg : colors.textMuted} strokeWidth={2.4} />
                      <Text
                        style={[
                          typography.buttonMd,
                          styles.decisionText,
                          { color: isRejected ? colors.statusDangerFg : colors.textSecondary },
                        ]}
                      >
                        Declinar
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>

          <View style={[styles.totalsCard, { backgroundColor: colors.surfaceCard, borderColor: colors.borderCard, borderRadius: radius.xl }]}>
            <Text style={[typography.eyebrow, { color: colors.textMuted }]}>
              TOTAL DE LO AUTORIZADO
            </Text>
            <View style={styles.totalsRow}>
              <Text style={[typography.bodyMd, { color: colors.textSecondary }]}>Subtotal</Text>
              <Text style={[typography.bodyMd, { color: colors.textStrong }]}>
                ${authorizedSubtotal.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
              </Text>
            </View>
            <View style={styles.totalsRow}>
              <Text style={[typography.bodyMd, { color: colors.textSecondary }]}>IVA (16%)</Text>
              <Text style={[typography.bodyMd, { color: colors.textStrong }]}>
                ${authorizedIva.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
              </Text>
            </View>
            <View style={[styles.totalsDivider, { backgroundColor: colors.borderDivider }]} />
            <View style={styles.totalsRow}>
              <Text style={[typography.titleCard, { color: colors.textStrong }]}>Total</Text>
              <Text style={[typography.headingXl, styles.totalsAmount, { color: colors.brandPrimary }]}>
                ${authorizedTotal.toLocaleString("es-MX", { minimumFractionDigits: 2 })} <Text style={styles.currencyBadge}>MXN</Text>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: "center",
  },
  contentWrapper: {
    width: "100%",
    maxWidth: 540,
    gap: 14,
    paddingTop: 14,
  },
  clientGreeting: {
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 34,
  },
  clientSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  vehicleCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderWidth: 1,
  },
  vehicleCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statusPill: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  itemsContainer: {
    gap: 12,
  },
  itemCard: {
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  itemPrice: {
    fontSize: 20,
    fontWeight: "800",
  },
  decisionRow: {
    flexDirection: "row",
    gap: 10,
  },
  decisionBtn: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  decisionText: {
    fontSize: 14,
    fontWeight: "700",
  },
  totalsCard: {
    borderWidth: 1,
    padding: 18,
    gap: 10,
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalsDivider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 4,
  },
  totalsAmount: {
    fontSize: 20,
    fontWeight: "800",
  },
  currencyBadge: {
    fontSize: 12,
    fontWeight: "600",
  },
});

