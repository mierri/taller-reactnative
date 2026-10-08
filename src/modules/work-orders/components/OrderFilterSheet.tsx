import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ArrowRight } from "lucide-react-native";
import { BottomSheet, Button, Switch } from "@/components";
import { useTheme } from "@/theme";
import { OperationalStatus } from "../types/work-order.types";
import { getOperationalStatusLabel } from "../utils/work-order-mapper";
import { FilterDropdown } from "./FilterDropdown";

export interface OrderFilterSheetProps {
  visible: boolean;
  onClose: () => void;
  advisors: string[];
  selectedAdvisor: string;
  onSelectAdvisor: (advisor: string) => void;
  selectedStatus: OperationalStatus | "all";
  onSelectStatus: (status: OperationalStatus | "all") => void;
  onlyDelayed: boolean;
  onToggleOnlyDelayed: (val: boolean) => void;
  includeClosed: boolean;
  onToggleIncludeClosed: (val: boolean) => void;
  onApply: () => void;
  onReset: () => void;
}

const STATUS_OPTIONS: (OperationalStatus | "all")[] = [
  "all",
  OperationalStatus.RECIBIDA,
  OperationalStatus.EN_DIAGNOSTICO,
  OperationalStatus.EN_ESPERA_COTIZACION,
  OperationalStatus.EN_ESPERA_APROBACION,
  OperationalStatus.EN_REPARACION,
  OperationalStatus.CONTROL_CALIDAD,
  OperationalStatus.LISTA_PARA_ENTREGA,
  OperationalStatus.ENTREGADA,
  OperationalStatus.CERRADA,
];

export const OrderFilterSheet: React.FC<OrderFilterSheetProps> = ({
  visible,
  onClose,
  advisors,
  selectedAdvisor,
  onSelectAdvisor,
  selectedStatus,
  onSelectStatus,
  onlyDelayed,
  onToggleOnlyDelayed,
  includeClosed,
  onToggleIncludeClosed,
  onApply,
  onReset,
}) => {
  const { colors, typography } = useTheme();
  const [showAdvisorMenu, setShowAdvisorMenu] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const advisorOptions = [
    { key: "all", label: "Todos" },
    ...advisors.map((adv) => ({ key: adv, label: adv })),
  ];

  const statusOptions = STATUS_OPTIONS.map((st) => ({
    key: st,
    label: st === "all" ? "Todos" : getOperationalStatusLabel(st),
  }));

  const currentAdvisorLabel =
    selectedAdvisor === "all" ? "Todos" : selectedAdvisor;

  const currentStatusLabel =
    selectedStatus === "all"
      ? "Todos"
      : getOperationalStatusLabel(selectedStatus);

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Ajusta tu vista">
      <View style={styles.container}>
        <FilterDropdown
          label="Asesor"
          valueLabel={currentAdvisorLabel}
          isOpen={showAdvisorMenu}
          onToggle={() => {
            setShowAdvisorMenu((prev) => !prev);
            setShowStatusMenu(false);
          }}
          options={advisorOptions}
          selectedKey={selectedAdvisor}
          onSelect={(key) => {
            onSelectAdvisor(key);
            setShowAdvisorMenu(false);
          }}
        />

        <FilterDropdown
          label="Estado"
          valueLabel={currentStatusLabel}
          isOpen={showStatusMenu}
          onToggle={() => {
            setShowStatusMenu((prev) => !prev);
            setShowAdvisorMenu(false);
          }}
          options={statusOptions}
          selectedKey={selectedStatus}
          onSelect={(key) => {
            onSelectStatus(key as OperationalStatus | "all");
            setShowStatusMenu(false);
          }}
        />

        <View style={styles.switchesContainer}>
          <Pressable
            style={styles.switchRow}
            onPress={() => onToggleOnlyDelayed(!onlyDelayed)}
          >
            <Switch
              value={onlyDelayed}
              onValueChange={onToggleOnlyDelayed}
              trackColor={{
                false: colors.borderGrabber,
                true: colors.brandPrimary,
              }}
              thumbColor="#ffffff"
            />
            <Text
              style={[
                typography.labelLg,
                styles.switchLabel,
                { color: colors.textStrong },
              ]}
            >
              Solo órdenes con retraso
            </Text>
          </Pressable>

          <Pressable
            style={styles.switchRow}
            onPress={() => onToggleIncludeClosed(!includeClosed)}
          >
            <Switch
              value={includeClosed}
              onValueChange={onToggleIncludeClosed}
              trackColor={{
                false: colors.borderGrabber,
                true: colors.brandPrimary,
              }}
              thumbColor="#ffffff"
            />
            <Text
              style={[
                typography.labelLg,
                styles.switchLabel,
                { color: colors.textStrong },
              ]}
            >
              Ver entregadas y cerradas
            </Text>
          </Pressable>
        </View>

        <View style={styles.actionsContainer}>
          <Button
            type="Primary"
            label="Ver órdenes"
            iconTrailing={<ArrowRight size={18} color="#ffffff" />}
            fullWidth
            onPress={onApply}
          />

          <TouchableOpacity
            style={styles.resetBtn}
            onPress={onReset}
            activeOpacity={0.7}
          >
            <Text
              style={[
                typography.labelMd,
                styles.resetText,
                { color: colors.textSecondary },
              ]}
            >
              Restablecer filtros
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingTop: 4,
    gap: 16,
  },
  switchesContainer: {
    gap: 16,
    paddingVertical: 4,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  switchLabel: {
    flex: 1,
  },
  actionsContainer: {
    width: "100%",
    alignItems: "center",
    gap: 12,
    marginTop: 8,
  },
  resetBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  resetText: {
    textAlign: "center",
  },
});
