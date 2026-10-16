import { BottomSheet, Button, CalendarView, Field } from "@/components";
import { useTheme } from "@/theme";
import { Calendar, Check, ChevronDown, Repeat } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  AccountPayableItem,
  RecurrenceFrequency,
  SupplierOption,
} from "../types/finance.types";
import { SupplierSearchDropdown } from "./SupplierSearchDropdown";

export interface SupplierAccountSheetProps {
  visible: boolean;
  onClose: () => void;
  suppliers: SupplierOption[];
  onSaveAccount: (
    data: Omit<
      AccountPayableItem,
      "id" | "paidAmount" | "balance" | "status" | "createdAt"
    >,
  ) => void;
}

const WEEKDAY_NAMES = [
  "domingo",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
];

const frequencyOptions: { key: RecurrenceFrequency; label: string }[] = [
  { key: "NONE", label: "Único" },
  { key: "WEEKLY", label: "Semanal" },
  { key: "BIWEEKLY", label: "Quincenal" },
  { key: "MONTHLY", label: "Mensual" },
];

function formatDateDisplay(d: Date): string {
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();
  return `${day} / ${month} / ${year}`;
}

function formatDateIso(d: Date): string {
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();
  return `${year}-${month}-${day}`;
}

export const SupplierAccountSheet: React.FC<SupplierAccountSheetProps> = ({
  visible,
  onClose,
  suppliers,
  onSaveAccount,
}) => {
  const { colors, typography, radius } = useTheme();

  const [selectedSupplier, setSelectedSupplier] =
    useState<SupplierOption | null>(null);
  const [supplierQuery, setSupplierQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [concept, setConcept] = useState("");
  const [amountStr, setAmountStr] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [frequency, setFrequency] = useState<RecurrenceFrequency>("NONE");

  const filteredSuppliers = useMemo(() => {
    const trimmed = supplierQuery.trim().toLowerCase();
    if (!trimmed) {
      return suppliers.slice(0, 3);
    }
    return suppliers.filter((s) => s.name.toLowerCase().includes(trimmed));
  }, [suppliers, supplierQuery]);

  const amount = parseFloat(amountStr) || 0;
  const isValid =
    selectedSupplier !== null && concept.trim().length > 0 && amount > 0;

  const handleQueryChange = (val: string) => {
    setSupplierQuery(val);
    setShowDropdown(true);
    if (selectedSupplier && selectedSupplier.name !== val) {
      setSelectedSupplier(null);
    }
  };

  const handleSelectSupplier = (supplier: SupplierOption) => {
    setSelectedSupplier(supplier);
    setSupplierQuery(supplier.name);
    setShowDropdown(false);
    if (!concept && supplier.defaultConcept) {
      setConcept(supplier.defaultConcept);
    }
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setShowCalendar(false);
  };

  const dayNum = selectedDate.getDate();
  const weekDay = WEEKDAY_NAMES[selectedDate.getDay()];

  const recurrenceSummary =
    frequency === "MONTHLY"
      ? `Se repetirá automáticamente el día ${dayNum} de cada mes.`
      : frequency === "WEEKLY"
        ? `Se repetirá automáticamente cada ${weekDay}.`
        : frequency === "BIWEEKLY"
          ? `Se repetirá automáticamente cada 2 semanas (${weekDay}).`
          : undefined;

  const recurrenceLabel =
    frequency === "MONTHLY"
      ? `Mensual · Día ${dayNum}`
      : frequency === "WEEKLY"
        ? `Semanal · Cada ${weekDay}`
        : frequency === "BIWEEKLY"
          ? `Quincenal · ${weekDay}`
          : undefined;

  const handleConfirm = () => {
    if (!isValid || !selectedSupplier) return;

    onSaveAccount({
      supplierId: selectedSupplier.id,
      supplierName: selectedSupplier.name,
      concept: concept.trim(),
      totalAmount: amount,
      dueDate: formatDateIso(selectedDate),
      recurrence:
        frequency !== "NONE"
          ? {
              isRecurring: true,
              frequency,
              repeatDay:
                frequency === "MONTHLY"
                  ? `Día ${dayNum}`
                  : `Cada ${weekDay}`,
              summaryLabel: recurrenceLabel,
            }
          : undefined,
    });

    handleClose();
  };

  const handleClose = () => {
    setSelectedSupplier(null);
    setSupplierQuery("");
    setShowDropdown(false);
    setConcept("");
    setAmountStr("");
    setSelectedDate(new Date());
    setShowCalendar(false);
    setFrequency("NONE");
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={handleClose} title="Cuenta de proveedor">
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.comboboxWrapper}>
          <Field
            label="Proveedor"
            placeholder="Buscar o seleccionar proveedor..."
            value={supplierQuery}
            onChangeText={handleQueryChange}
            onFocus={() => setShowDropdown(true)}
            trailingIcon={
              <Pressable
                onPress={() => setShowDropdown((prev) => !prev)}
                hitSlop={8}
              >
                <ChevronDown size={20} color={colors.textMuted} />
              </Pressable>
            }
          />
          <SupplierSearchDropdown
            results={filteredSuppliers}
            onSelect={handleSelectSupplier}
            visible={showDropdown}
          />
        </View>

        <Field
          label="Compra o concepto"
          placeholder="Ej. Compra de filtros y lubricantes"
          value={concept}
          onChangeText={setConcept}
        />

        <Field
          label="Monto total · MXN"
          placeholder="0.00"
          value={amountStr}
          onChangeText={setAmountStr}
          keyboardType="decimal-pad"
        />

        <View style={styles.dateSection}>
          <Field
            type="Select"
            label="Fecha de vencimiento"
            value={formatDateDisplay(selectedDate)}
            onPress={() => setShowCalendar((prev) => !prev)}
            trailingIcon={<Calendar size={20} color={colors.brandPrimary} />}
          />

          {showCalendar && (
            <CalendarView
              selectedDate={selectedDate}
              onSelectDate={handleSelectDate}
            />
          )}
        </View>

        <View style={styles.recurrenceSection}>
          <View style={styles.recurrenceTitleRow}>
            <Repeat size={16} color={colors.brandPrimary} strokeWidth={2} />
            <Text style={[typography.labelLg, { color: colors.textStrong }]}>
              Periodicidad del pago
            </Text>
          </View>

          <View style={styles.chipsRow}>
            {frequencyOptions.map((opt) => {
              const isSelected = frequency === opt.key;
              return (
                <TouchableOpacity
                  key={opt.key}
                  onPress={() => setFrequency(opt.key)}
                  activeOpacity={0.8}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: isSelected
                        ? colors.brandPrimary
                        : colors.surfaceCard,
                      borderColor: isSelected
                        ? colors.brandPrimary
                        : colors.borderCard,
                      borderRadius: radius.full,
                    },
                  ]}
                >
                  <Text
                    style={[
                      typography.captionMedium,
                      {
                        color: isSelected
                          ? colors.surfaceCard
                          : colors.textSecondary,
                      },
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {recurrenceSummary && (
            <View
              style={[
                styles.recurrenceInfoBox,
                {
                  backgroundColor: colors.surfaceTile,
                  borderColor: colors.borderDivider,
                  borderRadius: radius.md,
                },
              ]}
            >
              <Repeat size={14} color={colors.brandPrimary} strokeWidth={2} />
              <Text
                style={[
                  typography.captionMedium,
                  styles.recurrenceInfoText,
                  { color: colors.textSecondary },
                ]}
              >
                {recurrenceSummary}
              </Text>
            </View>
          )}
        </View>

        <Button
          type="Primary"
          label="Guardar cambios"
          fullWidth
          disabled={!isValid}
          onPress={handleConfirm}
          iconTrailing={
            <Check
              size={18}
              color={isValid ? colors.textOnBrand : colors.textMuted}
              strokeWidth={2.5}
            />
          }
        />
      </ScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingBottom: 24,
  },
  comboboxWrapper: {
    position: "relative",
    zIndex: 10,
  },
  dateSection: {
    gap: 8,
  },
  recurrenceSection: {
    gap: 8,
  },
  recurrenceTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  chipsRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
  },
  recurrenceInfoBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderWidth: 1,
    marginTop: 4,
  },
  recurrenceInfoText: {
    flex: 1,
    lineHeight: 16,
  },
});
