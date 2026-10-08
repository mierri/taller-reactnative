import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Check, ChevronLeft, ChevronRight } from "lucide-react-native";
import { BottomSheet, Button } from "@/components";
import { useTheme } from "@/theme";

const DAYS_HEADER = ["D", "L", "M", "M", "J", "V", "S"];
const TIME_OPTIONS = [
  "9:00 AM",
  "11:00 AM",
  "1:00 PM",
  "3:00 PM",
  "5:00 PM",
  "6:00 PM",
];

const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export interface DateTimePickerSheetProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (formatted: string) => void;
  initialDate?: Date;
}

export const DateTimePickerSheet: React.FC<DateTimePickerSheetProps> = ({
  visible,
  onClose,
  onConfirm,
  initialDate,
}) => {
  const { colors, radius, typography } = useTheme();

  const [currentYear, setCurrentYear] = useState(() =>
    initialDate ? initialDate.getFullYear() : 2026
  );
  const [currentMonth, setCurrentMonth] = useState(() =>
    initialDate ? initialDate.getMonth() : 9
  );
  const [selectedDay, setSelectedDay] = useState(() =>
    initialDate ? initialDate.getDate() : 15
  );
  const [selectedTime, setSelectedTime] = useState("6:00 PM");

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleConfirm = () => {
    const monthName = MONTH_NAMES[currentMonth].slice(0, 3);
    const result = `${selectedDay} ${monthName} ${currentYear}, ${selectedTime}`;
    onConfirm(result);
    onClose();
  };

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanksArray = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Fecha y hora de entrega"
    >
      <View style={styles.container}>
        <View style={styles.calendarCard}>
          <View style={styles.monthHeader}>
            <Text
              style={[typography.titleCard, { color: colors.textStrong }]}
            >
              {MONTH_NAMES[currentMonth]} {currentYear}
            </Text>
            <View style={styles.navRow}>
              <Pressable
                onPress={handlePrevMonth}
                hitSlop={8}
                style={styles.navBtn}
              >
                <ChevronLeft size={20} color={colors.textStrong} />
              </Pressable>
              <Pressable
                onPress={handleNextMonth}
                hitSlop={8}
                style={styles.navBtn}
              >
                <ChevronRight size={20} color={colors.textStrong} />
              </Pressable>
            </View>
          </View>

          <View style={styles.weekRow}>
            {DAYS_HEADER.map((d, index) => (
              <Text
                key={index}
                style={[
                  typography.captionMedium,
                  styles.weekText,
                  { color: colors.textMuted },
                ]}
              >
                {d}
              </Text>
            ))}
          </View>

          <View style={styles.daysGrid}>
            {blanksArray.map((i) => (
              <View key={`b-${i}`} style={styles.dayCell} />
            ))}
            {daysArray.map((day) => {
              const isSelected = day === selectedDay;
              return (
                <Pressable
                  key={day}
                  onPress={() => setSelectedDay(day)}
                  style={[
                    styles.dayCell,
                    isSelected && {
                      backgroundColor: colors.brandPrimary,
                      borderRadius: radius.full,
                    },
                  ]}
                >
                  <Text
                    style={[
                      typography.bodyMd,
                      {
                        color: isSelected
                          ? colors.textOnBrand
                          : colors.textStrong,
                        fontFamily: isSelected
                          ? typography.titleCard.fontFamily
                          : typography.bodyMd.fontFamily,
                      },
                    ]}
                  >
                    {day}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.timeSection}>
          <Text style={[typography.labelLg, { color: colors.textLabel }]}>
            Hora aproximada
          </Text>
          <View style={styles.timeGrid}>
            {TIME_OPTIONS.map((time) => {
              const isSelected = selectedTime === time;
              return (
                <Pressable
                  key={time}
                  onPress={() => setSelectedTime(time)}
                  style={[
                    styles.timeChip,
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
                    {time}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.actionContainer}>
          <Button
            type="Primary"
            label="Confirmar fecha y hora"
            iconTrailing={
              <Check size={18} color="#ffffff" strokeWidth={2.4} />
            }
            fullWidth
            onPress={handleConfirm}
          />
        </View>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingTop: 4,
  },
  calendarCard: {
    gap: 12,
  },
  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  navRow: {
    flexDirection: "row",
    gap: 8,
  },
  navBtn: {
    padding: 6,
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  weekText: {
    width: 36,
    textAlign: "center",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: "14.28%",
    height: 38,
    justifyContent: "center",
    alignItems: "center",
  },
  timeSection: {
    gap: 8,
    paddingTop: 4,
  },
  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  timeChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
  },
  actionContainer: {
    marginTop: 8,
  },
});

