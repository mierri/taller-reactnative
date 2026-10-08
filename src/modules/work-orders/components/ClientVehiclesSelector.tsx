import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Car } from "lucide-react-native";
import { useTheme } from "@/theme";
import { MockVehicle } from "../mocks/vehicles.mock";

export interface ClientVehiclesSelectorProps {
  clientName: string;
  vehicles: MockVehicle[];
  selectedPlate?: string;
  selectedId?: string;
  onSelect: (vehicle: MockVehicle) => void;
}

export const ClientVehiclesSelector: React.FC<
  ClientVehiclesSelectorProps
> = ({ clientName, vehicles, selectedPlate, selectedId, onSelect }) => {
  const { colors, radius, typography } = useTheme();

  if (vehicles.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={[typography.labelMd, { color: colors.textLabel }]}>
        Vehículos de {clientName}
      </Text>
      <View style={styles.list}>
        {vehicles.map((v) => {
          const isSelected = selectedId
            ? selectedId === v.id
            : Boolean(selectedPlate && selectedPlate.toUpperCase() === v.plate.toUpperCase());
          return (
            <Pressable
              key={v.id}
              onPress={() => onSelect(v)}
              style={[
                styles.chip,
                {
                  backgroundColor: isSelected
                    ? colors.brandPrimary
                    : colors.surfaceInput,
                  borderColor: isSelected
                    ? colors.brandPrimary
                    : colors.borderButton,
                  borderRadius: radius.md,
                },
              ]}
            >
              <Car
                size={16}
                color={
                  isSelected ? colors.textOnBrand : colors.textSecondary
                }
              />
              <Text
                style={[
                  typography.captionMedium,
                  {
                    color: isSelected
                      ? colors.textOnBrand
                      : colors.textStrong,
                  },
                ]}
              >
                {v.brand} {v.model} ({v.plate})
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  list: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
});

