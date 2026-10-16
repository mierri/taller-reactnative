import { BottomSheet, Button, CalendarView, Field } from "@/components";
import { useTheme } from "@/theme";
import { Calendar, Check } from "lucide-react-native";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ManualMovementItem,
  ManualMovementKind,
  ManualMovementMethod,
} from "../types/finance.types";

export interface ManualMovementSheetProps {
  visible: boolean;
  onClose: () => void;
  onSaveMovement: (data: Omit<ManualMovementItem, "id">) => void;
}

const kindOptions: { key: ManualMovementKind; label: string }[] = [
  { key: "EXPENSE", label: "Gasto" },
  { key: "INCOME", label: "Ingreso" },
];

const methodOptions: { key: ManualMovementMethod; label: string }[] = [
  { key: "CASH", label: "Efectivo" },
  { key: "TRANSFER", label: "Transferencia" },
  { key: "CARD", label: "Tarjeta" },
];

function formatDateDisplay(d: Date): string {
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();
  return `${day} / ${month} / ${year}`;
}

export const ManualMovementSheet: React.FC<ManualMovementSheetProps> = ({
  visible,
  onClose,
  onSaveMovement,
}) => {
  const { colors, typography, radius } = useTheme();

  const [type, setType] = useState<ManualMovementKind>("EXPENSE");
  const [concept, setConcept] = useState("");
  const [amountStr, setAmountStr] = useState("");
  const [method, setMethod] = useState<ManualMovementMethod>("CASH");
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  const amount = parseFloat(amountStr) || 0;
  const isValid = concept.trim().length > 0 && amount > 0;

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setShowCalendar(false);
  };

  const handleConfirm = () => {
    if (!isValid) return;

    onSaveMovement({
      type,
      concept: concept.trim(),
      amount,
      paymentMethod: method,
      createdAt: formatDateDisplay(selectedDate),
    });

    handleClose();
  };

  const handleClose = () => {
    setType("EXPENSE");
    setConcept("");
    setAmountStr("");
    setMethod("CASH");
    setSelectedDate(new Date());
    setShowCalendar(false);
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={handleClose} title="Agregar movimiento">
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={[typography.labelLg, { color: colors.textStrong }]}>
            Tipo de movimiento
          </Text>
          <View style={styles.chipsRow}>
            {kindOptions.map((opt) => {
              const isSelected = type === opt.key;
              return (
                <TouchableOpacity
                  key={opt.key}
                  onPress={() => setType(opt.key)}
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
        </View>

        <Field
          label="Concepto"
          placeholder={
            type === "EXPENSE"
              ? "Ej. Renta, internet, insumos o papelería"
              : "Ej. Venta de refacción usada, chatarra"
          }
          value={concept}
          onChangeText={setConcept}
        />

        <Field
          label="Monto · MXN"
          placeholder="0.00"
          value={amountStr}
          onChangeText={setAmountStr}
          keyboardType="decimal-pad"
        />

        <View style={styles.section}>
          <Field
            type="Select"
            label="Fecha"
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

        <View style={styles.section}>
          <Text style={[typography.labelLg, { color: colors.textStrong }]}>
            Método de pago / cuenta
          </Text>
          <View style={styles.chipsRow}>
            {methodOptions.map((opt) => {
              const isSelected = method === opt.key;
              return (
                <TouchableOpacity
                  key={opt.key}
                  onPress={() => setMethod(opt.key)}
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
        </View>

        <Button
          type="Primary"
          label="Registrar movimiento"
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
  section: {
    gap: 8,
  },
  chipsRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
});
