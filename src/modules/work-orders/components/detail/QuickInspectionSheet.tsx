import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BottomSheet } from "@/components";
import { useTheme } from "@/theme";
import {
  InspectionItemStatus,
  QuickInspectionState,
} from "../../types/work-order-detail.types";
import {
  getInspectionStatusColor,
  getInspectionStatusLabel,
} from "../../utils/detail-formatters";

export interface QuickInspectionSheetProps {
  visible: boolean;
  onClose: () => void;
  currentInspection: QuickInspectionState;
  onSave: (inspection: QuickInspectionState) => void;
}

export const QuickInspectionSheet: React.FC<QuickInspectionSheetProps> = ({
  visible,
  onClose,
  currentInspection,
  onSave,
}) => {
  const { colors, typography, radius } = useTheme();
  const [brakes, setBrakes] = useState<InspectionItemStatus>(
    currentInspection.brakes,
  );
  const [levels, setLevels] = useState<InspectionItemStatus>(
    currentInspection.levels,
  );
  const [tires, setTires] = useState<InspectionItemStatus>(
    currentInspection.tires,
  );

  const statuses: InspectionItemStatus[] = [
    "sin_problema",
    "revisar",
    "requiere_atencion",
  ];

  const handleSave = () => {
    onSave({ brakes, levels, tires });
    onClose();
  };

  const renderSection = (
    label: string,
    current: InspectionItemStatus,
    setter: (s: InspectionItemStatus) => void,
  ) => (
    <View style={styles.sectionContainer}>
      <Text style={[typography.buttonMd, { color: colors.textStrong }]}>
        {label}
      </Text>
      <View style={styles.optionsRow}>
        {statuses.map((status) => {
          const isSelected = current === status;
          const dotColor = getInspectionStatusColor(status);
          const statusText = getInspectionStatusLabel(status);

          return (
            <TouchableOpacity
              key={status}
              onPress={() => setter(status)}
              activeOpacity={0.7}
              style={[
                styles.optionChip,
                {
                  backgroundColor: isSelected
                    ? colors.surfaceInput
                    : colors.surfaceTile,
                  borderColor: isSelected
                    ? colors.brandPrimary
                    : colors.borderInput,
                  borderRadius: radius.lg,
                },
              ]}
            >
              <View
                style={[styles.statusDot, { backgroundColor: dotColor }]}
              />
              <Text
                style={[
                  typography.captionMedium,
                  {
                    color: isSelected
                      ? colors.brandPrimary
                      : colors.textSecondary,
                    fontWeight: isSelected ? "600" : "500",
                    fontSize: 12,
                  },
                ]}
              >
                {statusText}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Inspección rápida"
    >
      <View style={styles.content}>
        {renderSection("Frenos", brakes, setBrakes)}
        {renderSection("Niveles de fluidos", levels, setLevels)}
        {renderSection("Llantas y suspensión", tires, setTires)}

        <TouchableOpacity
          onPress={handleSave}
          activeOpacity={0.8}
          style={[
            styles.saveButton,
            {
              backgroundColor: colors.brandPrimary,
              borderRadius: radius.xl,
            },
          ]}
        >
          <Text
            style={[
              typography.buttonMd,
              styles.saveButtonText,
              { color: colors.textOnBrand },
            ]}
          >
            Guardar inspección
          </Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
    gap: 18,
  },
  sectionContainer: {
    gap: 8,
  },
  optionsRow: {
    flexDirection: "row",
    gap: 8,
  },
  optionChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderWidth: 1,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  saveButton: {
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: "700",
  },
});

