import { AppHeader, Button, Field, StepProgress } from "@/components";
import { useTheme } from "@/theme";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Plus } from "lucide-react-native";
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
import { AddVehicleSheet } from "../components/AddVehicleSheet";
import { ClientVehiclesSelector } from "../components/ClientVehiclesSelector";
import { OptionPickerSheet } from "../components/OptionPickerSheet";
import { PlateInputWithScanner } from "../components/PlateInputWithScanner";
import { StepNavButtons } from "../components/StepNavButtons";
import { VehicleBasicFields } from "../components/VehicleBasicFields";
import {
    getMockVehicles,
    MockVehicle,
    VehicleType,
} from "../mocks/vehicles.mock";

const VEHICLE_TYPES: VehicleType[] = ["Auto", "Camioneta", "Carga"];

export interface NewWorkOrderStepTwoScreenProps {
  onSuccess?: () => void;
}

export const NewWorkOrderStepTwoScreen: React.FC<
  NewWorkOrderStepTwoScreenProps
> = () => {
  const { colors, layout, typography } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{
    clientId?: string;
    clientName?: string;
    clientPhone?: string;
    clientType?: string;
    presetVehicle?: string;
    presetPlate?: string;
  }>();

  const initialVehicles = params.clientId
    ? getMockVehicles(params.clientId)
    : [];
  const defaultVehicle = initialVehicles[0];

  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(
    () => defaultVehicle?.id ?? null,
  );
  const [brand, setBrand] = useState(() => defaultVehicle?.brand ?? "");
  const [model, setModel] = useState(() => defaultVehicle?.model ?? "");
  const [year, setYear] = useState(() => defaultVehicle?.year ?? "");
  const [plate, setPlate] = useState(
    () => defaultVehicle?.plate ?? params.presetPlate ?? "",
  );
  const [vehicleType, setVehicleType] = useState<VehicleType>(
    () => defaultVehicle?.vehicleType ?? "Auto",
  );
  const [showTypePicker, setShowTypePicker] = useState(false);
  const [vin, setVin] = useState(() => defaultVehicle?.vin ?? "");
  const [mileage, setMileage] = useState(() => defaultVehicle?.mileage ?? "");
  const [reason, setReason] = useState("");

  const [clientVehicles, setClientVehicles] = useState<MockVehicle[]>(
    () => initialVehicles,
  );
  const [showAddVehicleSheet, setShowAddVehicleSheet] = useState(false);
  const [vehicleError, setVehicleError] = useState<string | null>(null);

  const selectExistingVehicle = (v: MockVehicle) => {
    setSelectedVehicleId(v.id);
    setBrand(v.brand);
    setModel(v.model);
    setYear(v.year);
    setPlate(v.plate);
    setVehicleType(v.vehicleType);
    setVin(v.vin || "");
    setMileage(v.mileage || "");
    setVehicleError(null);
  };

  const handleVehicleCreated = (created: MockVehicle) => {
    setClientVehicles((prev) => [created, ...prev]);
    selectExistingVehicle(created);
  };

  const handleContinue = () => {
    if (!brand.trim() && !model.trim()) {
      setVehicleError("Ingresa la marca y modelo del vehículo");
      return;
    }

    router.push({
      pathname: "/orders/new/step-three" as any,
      params: {
        ...params,
        vehicleBrand: brand.trim(),
        vehicleModel: model.trim(),
        vehicleYear: year.trim(),
        vehiclePlate: plate.trim().toUpperCase(),
        vehicleType,
        vehicleVin: vin.trim().toUpperCase(),
        vehicleMileage: mileage.trim(),
        reason: reason.trim(),
      },
    });
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
              Paso 2 de 3
            </Text>
          </View>

          <View style={styles.progressSection}>
            <StepProgress totalSteps={3} currentStep={2} />
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
              Registra los datos del auto para la inspección.
            </Text>
          </View>

          <View style={styles.formSection}>
            <ClientVehiclesSelector
              clientName={params.clientName ?? "Cliente"}
              vehicles={clientVehicles}
              selectedId={selectedVehicleId ?? undefined}
              selectedPlate={plate}
              onSelect={selectExistingVehicle}
            />

            <VehicleBasicFields
              brand={brand}
              setBrand={(val) => {
                setBrand(val);
                if (vehicleError) setVehicleError(null);
              }}
              model={model}
              setModel={(val) => {
                setModel(val);
                if (vehicleError) setVehicleError(null);
              }}
              year={year}
              setYear={setYear}
              vehicleType={vehicleType}
              onPressType={() => setShowTypePicker(true)}
              error={vehicleError}
            />

            <PlateInputWithScanner plate={plate} onChangePlate={setPlate} />

            <Field
              label="Kilometraje actual"
              placeholder="Ej. 60,000 km"
              value={mileage}
              onChangeText={setMileage}
              keyboardType="numeric"
            />

            <Field
              label="Número de serie (VIN) · opcional"
              placeholder="17 caracteres"
              value={vin}
              onChangeText={(val) => setVin(val.toUpperCase())}
              helper="17 caracteres, sin I, O ni Q."
              autoCapitalize="characters"
              maxLength={17}
            />

            {clientVehicles.length > 0 && (
              <Button
                type="Secondary"
                label="Agregar otro vehículo"
                iconLeading={<Plus size={18} color={colors.brandPrimaryText} />}
                fullWidth
                onPress={() => setShowAddVehicleSheet(true)}
              />
            )}

            <Field
              type="Textarea"
              label="Motivo de ingreso"
              placeholder="¿Qué necesita revisar el cliente?"
              value={reason}
              onChangeText={setReason}
            />

            <StepNavButtons
              onBack={() => router.back()}
              onSubmit={handleContinue}
              submitLabel="Continuar"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <AddVehicleSheet
        visible={showAddVehicleSheet}
        onClose={() => setShowAddVehicleSheet(false)}
        onVehicleCreated={handleVehicleCreated}
        clientId={params.clientId}
        initialPlate={plate}
      />

      <OptionPickerSheet
        visible={showTypePicker}
        onClose={() => setShowTypePicker(false)}
        title="Tipo de vehículo"
        options={VEHICLE_TYPES}
        selectedOption={vehicleType}
        onSelect={setVehicleType}
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
});
