import { AppHeader, Banner, Field, StepProgress } from "@/components";
import { useTheme } from "@/theme";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ShieldCheck } from "lucide-react-native";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AdvisorPickerSheet } from "../components/AdvisorPickerSheet";
import {
  BelongingItem,
  BelongingsCard,
} from "../components/BelongingsCard";
import { DateTimePickerSheet } from "../components/DateTimePickerSheet";
import { FuelGaugeCard } from "../components/FuelGaugeCard";
import { StepNavButtons } from "../components/StepNavButtons";
import { MockAdvisor } from "../mocks/advisors.mock";
import { addMockWorkOrder } from "../mocks/work-orders.mock";

export interface NewWorkOrderStepThreeScreenProps {
  onSuccess?: () => void;
}

export const NewWorkOrderStepThreeScreen: React.FC<
  NewWorkOrderStepThreeScreenProps
> = ({ onSuccess }) => {
  const { colors, layout, radius, typography } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{
    clientId?: string;
    clientName?: string;
    clientPhone?: string;
    vehicleBrand?: string;
    vehicleModel?: string;
    vehicleYear?: string;
    vehiclePlate?: string;
    vehicleType?: string;
    vehicleVin?: string;
    vehicleMileage?: string;
    reason?: string;
  }>();

  const [selectedAdvisor, setSelectedAdvisor] = useState<MockAdvisor>({
    id: "adv-1",
    name: "Daniel",
    initial: "D",
  });
  const [showAdvisorPicker, setShowAdvisorPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [estimatedDelivery, setEstimatedDelivery] = useState("Mañana, 6:00 PM");
  const [fuelLevel, setFuelLevel] = useState(50);
  const [submitting, setSubmitting] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  const [belongings, setBelongings] = useState<BelongingItem[]>([
    { id: "1", name: "Llaves", checked: true },
    { id: "2", name: "Documentos", checked: false },
    { id: "3", name: "Refacción", checked: false },
  ]);

  const handleToggleBelonging = (id: string) => {
    setBelongings((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleAddBelonging = (name: string) => {
    setBelongings((prev) => [
      ...prev,
      { id: `bel-${Date.now()}`, name, checked: true },
    ]);
  };

  const handleRemoveBelonging = (id: string) => {
    setBelongings((prev) => prev.filter((item) => item.id !== id));
  };

  const handleRegister = () => {
    if (!params.vehicleBrand && !params.vehicleModel) {
      setErrorBanner("No se pudo guardar la orden. Faltan datos del vehículo.");
      return;
    }

    setSubmitting(true);
    const vehicleDesc = [
      params.vehicleBrand,
      params.vehicleModel,
      params.vehiclePlate ? `(${params.vehiclePlate})` : "",
    ]
      .filter(Boolean)
      .join(" ");

    try {
      const created = addMockWorkOrder({
        clientId: params.clientId,
        clientName: params.clientName || "Cliente",
        vehicleDescription: vehicleDesc,
        serviceAdvisorId: selectedAdvisor.id,
        serviceAdvisorName: selectedAdvisor.name,
        failureDescription: params.reason || "Recepción general y diagnóstico",
        estimatedDelivery,
      });

      setTimeout(() => {
        setSubmitting(false);
        onSuccess?.();
        router.replace({
          pathname: "/orders" as any,
          params: {
            orderCreated: "true",
            folio: created.code,
          },
        });
      }, 400);
    } catch {
      setSubmitting(false);
      setErrorBanner("No se pudo guardar la orden de trabajo. Intenta nuevamente.");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceApp }]}>
      <AppHeader
        type="Detail"
        title="Recepción"
        hideActions
        onBackPress={() => router.back()}
      />

      {errorBanner && (
        <Banner
          type="Danger"
          layout="Floating"
          title="No se pudo guardar"
          message={errorBanner}
          dismissible
          autoDismiss
          onDismiss={() => setErrorBanner(null)}
        />
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingHorizontal: layout.margin,
              paddingBottom: Math.max(insets.bottom, 24) + 16,
            },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.eyebrowRow}>
            <Text
              style={[typography.eyebrow, { color: colors.brandPrimaryText }]}
            >
              NUEVA ORDEN
            </Text>
            <Text style={[typography.caption, { color: colors.textMuted }]}>
              Paso 3 de 3
            </Text>
          </View>

          <View style={styles.progressSection}>
            <StepProgress totalSteps={3} currentStep={3} />
          </View>

          <View style={styles.headingSection}>
            <Text style={[typography.headingXl, { color: colors.textStrong }]}>
              Detalles de la orden
              <Text style={{ color: colors.brandPrimaryText }}>.</Text>
            </Text>

            <Text
              style={[
                typography.bodyMd,
                styles.subtitle,
                { color: colors.textSecondary },
              ]}
            >
              Una recepción clara. Sin sorpresas para nadie.
            </Text>
          </View>

          <View style={styles.formSection}>
            <Field
              type="Select"
              label="Asesor de servicio"
              placeholder="Seleccionar asesor"
              value={selectedAdvisor.name}
              onPress={() => setShowAdvisorPicker(true)}
            />

            <Field
              type="Select"
              label="Entrega estimada"
              placeholder="Seleccionar fecha y hora"
              value={estimatedDelivery}
              onPress={() => setShowDatePicker(true)}
            />

            <FuelGaugeCard
              fuelLevel={fuelLevel}
              onFuelLevelChange={setFuelLevel}
            />

            <BelongingsCard
              items={belongings}
              onToggleItem={handleToggleBelonging}
              onAddItem={handleAddBelonging}
              onRemoveItem={handleRemoveBelonging}
            />

            <View
              style={[
                styles.noticeBanner,
                {
                  backgroundColor: colors.surfaceTile,
                  borderColor: colors.borderButton,
                  borderRadius: radius.lg,
                },
              ]}
            >
              <ShieldCheck size={20} color={colors.brandPrimaryText} />
              <Text
                style={[
                  typography.bodyMd,
                  styles.noticeText,
                  { color: colors.textStrong },
                ]}
              >
                Verifica la información antes de avanzar.
              </Text>
            </View>

            <StepNavButtons
              onBack={() => router.back()}
              onSubmit={handleRegister}
              submitLabel="Registrar recepción"
              submitting={submitting}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <AdvisorPickerSheet
        visible={showAdvisorPicker}
        onClose={() => setShowAdvisorPicker(false)}
        onSelect={(adv) => setSelectedAdvisor(adv)}
      />

      <DateTimePickerSheet
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onConfirm={(formatted) => setEstimatedDelivery(formatted)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: { paddingTop: 28 },
  eyebrowRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  progressSection: { marginBottom: 28 },
  headingSection: { gap: 8, marginBottom: 24 },
  subtitle: { lineHeight: 18, paddingVertical: 12 },
  formSection: { gap: 20 },
  noticeBanner: {
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  noticeText: {
    flex: 1,
  },
});
