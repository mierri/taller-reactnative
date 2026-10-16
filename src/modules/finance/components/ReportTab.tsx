import { CalendarView } from "@/components";
import { useTheme } from "@/theme";
import { Calendar, Download, FileText, Table } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FinancialReportSummary } from "../types/finance.types";
import { exportReportCsv, exportReportPdf } from "../utils/reportExport";
import { ReportChartsCard } from "./ReportChartsCard";
import { ReportMetricsCard } from "./ReportMetricsCard";

export interface ReportTabProps {
  report: FinancialReportSummary;
  fromDate: Date;
  toDate: Date;
  onSelectFromDate: (date: Date) => void;
  onSelectToDate: (date: Date) => void;
}

function formatDateDisplay(d: Date): string {
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();
  return `${day} / ${month} / ${year}`;
}

export const ReportTab: React.FC<ReportTabProps> = ({
  report,
  fromDate,
  toDate,
  onSelectFromDate,
  onSelectToDate,
}) => {
  const { colors, typography, radius, shadows } = useTheme();

  const [activeCalendar, setActiveCalendar] = useState<"from" | "to" | null>(
    null,
  );
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingCsv, setIsExportingCsv] = useState(false);

  const handlePickDate = (date: Date) => {
    if (activeCalendar === "from") {
      onSelectFromDate(date);
    } else if (activeCalendar === "to") {
      onSelectToDate(date);
    }
    setActiveCalendar(null);
  };

  const handleExportPdf = async () => {
    try {
      setIsExportingPdf(true);
      await exportReportPdf(report);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleExportCsv = async () => {
    try {
      setIsExportingCsv(true);
      await exportReportCsv(report);
    } finally {
      setIsExportingCsv(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.dateFilterRow}>
        <View style={styles.dateCol}>
          <Text style={[typography.labelLg, { color: colors.textStrong }]}>
            Desde
          </Text>
          <TouchableOpacity
            onPress={() =>
              setActiveCalendar((prev) => (prev === "from" ? null : "from"))
            }
            activeOpacity={0.8}
            style={[
              styles.dateBox,
              {
                backgroundColor: colors.surfaceCard,
                borderColor:
                  activeCalendar === "from"
                    ? colors.brandPrimary
                    : colors.borderInput,
                borderRadius: radius.xl,
              },
            ]}
          >
            <Text
              style={[
                typography.bodyMd,
                styles.dateText,
                { color: colors.textStrong },
              ]}
            >
              {formatDateDisplay(fromDate)}
            </Text>
            <Calendar size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.dateCol}>
          <Text style={[typography.labelLg, { color: colors.textStrong }]}>
            Hasta
          </Text>
          <TouchableOpacity
            onPress={() =>
              setActiveCalendar((prev) => (prev === "to" ? null : "to"))
            }
            activeOpacity={0.8}
            style={[
              styles.dateBox,
              {
                backgroundColor: colors.surfaceCard,
                borderColor:
                  activeCalendar === "to"
                    ? colors.brandPrimary
                    : colors.borderInput,
                borderRadius: radius.xl,
              },
            ]}
          >
            <Text
              style={[
                typography.bodyMd,
                styles.dateText,
                { color: colors.textStrong },
              ]}
            >
              {formatDateDisplay(toDate)}
            </Text>
            <Calendar size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {activeCalendar !== null && (
        <View style={styles.calendarInlineContainer}>
          <CalendarView
            selectedDate={activeCalendar === "from" ? fromDate : toDate}
            onSelectDate={handlePickDate}
          />
        </View>
      )}

      <ReportMetricsCard report={report} />

      <ReportChartsCard report={report} />

      <View style={styles.exportSection}>
        <TouchableOpacity
          onPress={handleExportPdf}
          disabled={isExportingPdf}
          activeOpacity={0.85}
          style={[
            styles.exportButton,
            {
              backgroundColor: colors.surfaceCard,
              borderColor: colors.borderCard,
              borderRadius: radius.xl,
            },
            shadows.card,
          ]}
        >
          {isExportingPdf ? (
            <ActivityIndicator size="small" color={colors.brandPrimary} />
          ) : (
            <>
              <FileText size={18} color={colors.brandPrimary} />
              <Text
                style={[typography.buttonMd, { color: colors.brandPrimary }]}
              >
                Descargar PDF
              </Text>
              <Download size={16} color={colors.brandPrimary} />
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleExportCsv}
          disabled={isExportingCsv}
          activeOpacity={0.85}
          style={[
            styles.exportButton,
            {
              backgroundColor: colors.surfaceCard,
              borderColor: colors.borderCard,
              borderRadius: radius.xl,
            },
            shadows.card,
          ]}
        >
          {isExportingCsv ? (
            <ActivityIndicator size="small" color={colors.brandPrimary} />
          ) : (
            <>
              <Table size={18} color={colors.brandPrimary} />
              <Text
                style={[typography.buttonMd, { color: colors.brandPrimary }]}
              >
                Exportar Excel / CSV
              </Text>
              <Download size={16} color={colors.brandPrimary} />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  dateFilterRow: {
    flexDirection: "row",
    gap: 12,
  },
  dateCol: {
    flex: 1,
    gap: 6,
  },
  dateBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
  },
  dateText: {
    flex: 1,
  },
  calendarInlineContainer: {
    marginTop: -4,
  },
  exportSection: {
    gap: 10,
    marginTop: 4,
  },
  exportButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
});

