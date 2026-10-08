import { AppHeader, Button, Field, StepProgress } from "@/components";
import { useTheme } from "@/theme";
import { useRouter } from "expo-router";
import { ArrowRight, Camera } from "lucide-react-native";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CapturePlateSheet } from "../components/CapturePlateSheet";

export interface NewWorkOrderStepOneScreenProps {
  onSuccess?: () => void;
}

export const NewWorkOrderStepOneScreen: React.FC<
  NewWorkOrderStepOneScreenProps
> = () => {
  const { colors, fonts, layout, radius, typography, space } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [clientName, setClientName] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [plate, setPlate] = useState("");
  const [reason, setReason] = useState("");
  const [showPlateModal, setShowPlateModal] = useState(false);

  const [clientError, setClientError] = useState<string | null>(null);
  const [vehicleError, setVehicleError] = useState<string | null>(null);

  const handleContinue = () => {
    let hasError = false;

    if (!clientName.trim()) {
      setClientError("Ingresa el nombre del cliente");
      hasError = true;
    } else {
      setClientError(null);
    }

    if (!vehicle.trim()) {
      setVehicleError("Ingresa el vehículo (marca, modelo y año)");
      hasError = true;
    } else {
      setVehicleError(null);
    }

    if (hasError) return;

    router.push({
      pathname: "/orders/new/step-two" as any,
      params: {
        clientName: clientName.trim(),
        vehicle: vehicle.trim(),
        plate: plate.trim().toUpperCase(),
        reason: reason.trim(),
      },
    });
  };

  const handlePlateConfirmed = (confirmedPlate: string) => {
    setPlate(confirmedPlate);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceApp }]}>
      <AppHeader
        type="Detail"
        title="Recepción"
        hideActions
        onBackPress={() => router.back()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingHorizontal: 24,
              paddingBottom: insets.bottom + 100,
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
              Paso 1 de 2
            </Text>
          </View>

          <View style={styles.progressSection}>
            <StepProgress totalSteps={2} currentStep={1} />
          </View>

          <View style={styles.headingSection}>
            <Text style={[typography.headingXl, { color: colors.textStrong }]}>
              ¿Qué vehículo recibimos
              <Text style={{ color: colors.brandPrimaryText }}>?</Text>
            </Text>

            <Text
              style={[
                typography.bodyMd,
                styles.subtitle,
                { color: colors.textSecondary },
              ]}
            >
              Primero, lo esencial. La cotización viene después.
            </Text>
          </View>

          <View style={styles.formSection}>
            <Field
              label="Nombre del cliente"
              placeholder="¿A nombre de quién?"
              value={clientName}
              onChangeText={(text) => {
                setClientName(text);
                if (clientError) setClientError(null);
              }}
              error={clientError ?? undefined}
            />

            <Field
              label="Vehículo"
              placeholder="Ej. Nissan Versa 2022"
              value={vehicle}
              onChangeText={(text) => {
                setVehicle(text);
                if (vehicleError) setVehicleError(null);
              }}
              helper="Marca, modelo y año"
              error={vehicleError ?? undefined}
            />

            <View style={styles.plateContainer}>
              <Text
                style={[
                  typography.labelLg,
                  styles.plateLabel,
                  { color: colors.textLabel },
                ]}
              >
                Placas
              </Text>
              <View style={styles.plateRow}>
                <View style={styles.plateInputWrapper}>
                  <Field
                    placeholder="PXM-482-B"
                    value={plate}
                    onChangeText={(text) => setPlate(text.toUpperCase())}
                    autoCapitalize="characters"
                    inputStyle={{
                      fontFamily: fonts.mono500,
                      fontSize: 16,
                      letterSpacing: 1,
                    }}
                  />
                </View>

                <Pressable
                  onPress={() => setShowPlateModal(true)}
                  style={({ pressed }) => [
                    styles.cameraButton,
                    {
                      backgroundColor: colors.surfaceTile,
                      borderColor: colors.borderButton,
                      borderRadius: radius.lg,
                      opacity: pressed ? 0.75 : 1,
                    },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="Capturar placa con cámara"
                >
                  <Camera
                    size={22}
                    color={colors.brandPrimaryText}
                    strokeWidth={2}
                  />
                </Pressable>
              </View>
            </View>

            <Field
              type="Textarea"
              label="Motivo de ingreso"
              placeholder="¿Qué necesita revisar el cliente?"
              value={reason}
              onChangeText={setReason}
            />
          </View>
        </ScrollView>

        <View
          style={[
            styles.bottomBar,
            {
              backgroundColor: colors.surfaceApp,
              paddingHorizontal: layout.margin,
              paddingBottom: Math.max(insets.bottom, 16),
            },
          ]}
        >
          <Button
            type="Primary"
            label="Continuar"
            iconTrailing={<ArrowRight size={18} color={colors.textOnBrand} />}
            fullWidth
            onPress={handleContinue}
          />
        </View>
      </KeyboardAvoidingView>

      <CapturePlateSheet
        visible={showPlateModal}
        onClose={() => setShowPlateModal(false)}
        initialPlate={plate}
        onConfirmPlate={handlePlateConfirmed}
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
  plateContainer: { width: "100%" },
  plateLabel: { marginBottom: 8 },
  plateRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    width: "100%",
  },
  plateInputWrapper: { flex: 1 },
  cameraButton: {
    width: 52,
    height: 52,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 12,
  },
});
