import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { useTheme } from "@/theme";

const DAYS_HEADER = ["D", "L", "M", "M", "J", "V", "S"];
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

export interface CalendarViewProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  selectedDate,
  onSelectDate,
}) => {
  const { colors, radius, typography } = useTheme();

  const [currentYear, setCurrentYear] = useState(() =>
    selectedDate.getFullYear(),
  );
  const [currentMonth, setCurrentMonth] = useState(() =>
    selectedDate.getMonth(),
  );

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

  const handleDayPress = (day: number) => {
    const newDate = new Date(currentYear, currentMonth, day);
    onSelectDate(newDate);
  };

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanksArray = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  const isCurrentSelectionInView =
    selectedDate.getFullYear() === currentYear &&
    selectedDate.getMonth() === currentMonth;

  return (
    <View
      style={[
        styles.calendarContainer,
        {
          backgroundColor: colors.surfaceCard,
          borderColor: colors.borderInput,
          borderRadius: radius.md,
        },
      ]}
    >
      <View style={styles.monthHeader}>
        <Text style={[typography.titleCard, { color: colors.textStrong }]}>
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
          const isSelected =
            isCurrentSelectionInView && day === selectedDate.getDate();
          return (
            <Pressable
              key={day}
              onPress={() => handleDayPress(day)}
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
  );
};

const styles = StyleSheet.create({
  calendarContainer: {
    padding: 12,
    borderWidth: 1,
    gap: 10,
  },
  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
    paddingBottom: 4,
  },
  navRow: {
    flexDirection: "row",
    gap: 6,
  },
  navBtn: {
    padding: 4,
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
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
});

