import React from "react";
import { StyleSheet, View } from "react-native";
import { Field } from "@/components";
import { VehicleType } from "../mocks/vehicles.mock";

export interface VehicleBasicFieldsProps {
  brand: string;
  setBrand: (val: string) => void;
  model: string;
  setModel: (val: string) => void;
  year: string;
  setYear: (val: string) => void;
  vehicleType: VehicleType;
  onPressType: () => void;
  error?: string | null;
}

export const VehicleBasicFields: React.FC<VehicleBasicFieldsProps> = ({
  brand,
  setBrand,
  model,
  setModel,
  year,
  setYear,
  vehicleType,
  onPressType,
  error,
}) => {
  return (
    <>
      <View style={styles.row}>
        <View style={styles.flex1}>
          <Field
            label="Marca"
            placeholder="Ej. Nissan"
            value={brand}
            onChangeText={setBrand}
            error={error ?? undefined}
          />
        </View>
        <View style={styles.flex1}>
          <Field
            label="Modelo"
            placeholder="Ej. Versa"
            value={model}
            onChangeText={setModel}
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.flex1}>
          <Field
            label="Año"
            placeholder="Ej. 2022"
            value={year}
            onChangeText={setYear}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.flex1}>
          <Field
            type="Select"
            label="Tipo de vehículo"
            value={vehicleType}
            onPress={onPressType}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 12 },
  flex1: { flex: 1 },
});
