import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Check } from "lucide-react-native";
import { BottomSheet, Button, Field } from "@/components";
import { useTheme } from "@/theme";
import {
  addMockVehicle,
  MockVehicle,
  VehicleType,
} from "../mocks/vehicles.mock";
import { PlateInputWithScanner } from "./PlateInputWithScanner";

const VEHICLE_TYPES: VehicleType[] = ["Auto", "Camioneta", "Carga"];

export interface AddVehicleSheetProps {
  visible: boolean;
  onClose: () => void;
  onVehicleCreated: (vehicle: MockVehicle) => void;
  clientId?: string;
  initialPlate?: string;
}

export const AddVehicleSheet: React.FC<AddVehicleSheetProps> = ({
  visible,
  onClose,
  onVehicleCreated,
  clientId,
  initialPlate = "",
}) => {
  const { colors, radius, typography } = useTheme();
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [vehicleType, setVehicleType] = useState<VehicleType>("Auto");
  const [plate, setPlate] = useState(initialPlate);
  const [mileage, setMileage] = useState("");
  const [vin, setVin] = useState("");

  const [brandError, setBrandError] = useState<string | null>(null);
  const [modelError, setModelError] = useState<string | null>(null);
  const [plateError, setPlateError] = useState<string | null>(null);

  const handleSave = () => {
    let hasError = false;
    if (!brand.trim()) {
      setBrandError("Ingresa la marca");
      hasError = true;
    } else {
      setBrandError(null);
    }

    if (!model.trim()) {
      setModelError("Ingresa el modelo");
      hasError = true;
    } else {
      setModelError(null);
    }

    if (!plate.trim()) {
      setPlateError("Ingresa las placas");
      hasError = true;
    } else {
      setPlateError(null);
    }

    if (hasError) return;

    const created = addMockVehicle({
      clientId,
      brand: brand.trim(),
      model: model.trim(),
      year: year.trim() || new Date().getFullYear().toString(),
      vehicleType,
      plate: plate.trim().toUpperCase(),
      vin: vin.trim().toUpperCase() || undefined,
      mileage: mileage.trim() || undefined,
    });

    onVehicleCreated(created);
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Nuevo vehículo">
      <View style={styles.container}>
        <View style={styles.row}>
          <View style={styles.flex1}>
            <Field
              label="Marca"
              placeholder="Ej. Nissan"
              value={brand}
              onChangeText={(val) => {
                setBrand(val);
                if (brandError) setBrandError(null);
              }}
              error={brandError ?? undefined}
              autoCapitalize="words"
            />
          </View>
          <View style={styles.flex1}>
            <Field
              label="Modelo"
              placeholder="Ej. Versa"
              value={model}
              onChangeText={(val) => {
                setModel(val);
                if (modelError) setModelError(null);
              }}
              error={modelError ?? undefined}
              autoCapitalize="words"
            />
          </View>
        </View>

        <Field
          label="Año"
          placeholder="Ej. 2022"
          value={year}
          onChangeText={setYear}
          keyboardType="numeric"
          maxLength={4}
        />

        <View style={styles.fieldGroup}>
          <Text style={[typography.labelLg, { color: colors.textLabel }]}>
            Tipo de vehículo
          </Text>
          <View style={styles.segmentRow}>
            {VEHICLE_TYPES.map((type) => {
              const isSelected = vehicleType === type;
              return (
                <Pressable
                  key={type}
                  onPress={() => setVehicleType(type)}
                  style={[
                    styles.segmentBtn,
                    {
                      backgroundColor: isSelected
                        ? colors.surfaceTile
                        : colors.surfaceInput,
                      borderColor: isSelected
                        ? colors.brandPrimary
                        : colors.borderButton,
                      borderRadius: radius.md,
                    },
                  ]}
                >
                  <Text
                    style={[
                      typography.labelMd,
                      {
                        color: isSelected
                          ? colors.brandPrimaryText
                          : colors.textStrong,
                        fontFamily: isSelected
                          ? typography.titleCard.fontFamily
                          : typography.labelMd.fontFamily,
                      },
                    ]}
                  >
                    {type}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <PlateInputWithScanner
          plate={plate}
          onChangePlate={(val) => {
            setPlate(val);
            if (plateError) setPlateError(null);
          }}
          error={plateError}
        />

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

        <View style={styles.actionContainer}>
          <Button
            type="Primary"
            label="Guardar vehículo"
            iconTrailing={
              <Check size={18} color="#ffffff" strokeWidth={2.4} />
            }
            fullWidth
            onPress={handleSave}
          />
        </View>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingTop: 8,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  fieldGroup: {
    gap: 8,
  },
  segmentRow: {
    flexDirection: "row",
    gap: 8,
  },
  segmentBtn: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  actionContainer: {
    marginTop: 8,
  },
});
