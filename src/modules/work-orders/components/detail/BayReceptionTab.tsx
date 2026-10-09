import { Switch } from "@/components";
import { useTheme } from "@/theme";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  Clock,
  FileText,
  RotateCcw,
  ShieldCheck,
} from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  DetailNoteItem,
  DetailPhotoItem,
  OrderDetailTabKey,
  QuickInspectionState,
} from "../../types/work-order-detail.types";
import { OperationalStatus } from "../../types/work-order.types";
import { BayDiagnosisCard } from "./BayDiagnosisCard";
import { BayFollowUpSection } from "./BayFollowUpSection";
import { BayMotivoCard } from "./BayMotivoCard";
import { BayPhotosCarousel } from "./BayPhotosCarousel";
import { BayQuickInspectionCard } from "./BayQuickInspectionCard";

export interface BayReceptionTabProps {
  failureDescription: string;
  mileageIn: number;
  fuelLevel: number;
  estimatedDelivery: string | null;
  diagnosis?: string | null;
  operationalStatus?: OperationalStatus;
  quickInspection: QuickInspectionState;
  notes: DetailNoteItem[];
  photos: DetailPhotoItem[];
  isLate: boolean;
  onToggleLate: (val: boolean) => void;
  onToggleInspectionItem: (key: keyof QuickInspectionState) => void;
  onToggleAllInspection?: () => void;
  onOpenAddNote: () => void;
  onOpenAddPhoto: () => void;
  onSelectPhoto: (photo: DetailPhotoItem) => void;
  onSaveDiagnosis?: (text: string) => void;
  onAdvanceToDiagnosis: () => void;
  onPrepareQuotation?: () => void;
  onSwitchTab?: (tab: OrderDetailTabKey) => void;
  onAdvanceToQualityControl?: () => void;
  onAdvanceToReadyForDelivery?: () => void;
  onRegisterDelivery?: () => void;
  onCloseOrder?: () => void;
  onWarrantyReentry?: () => void;
}

export const BayReceptionTab: React.FC<BayReceptionTabProps> = ({
  failureDescription,
  mileageIn,
  fuelLevel,
  estimatedDelivery,
  diagnosis,
  operationalStatus = OperationalStatus.RECIBIDA,
  quickInspection,
  notes,
  photos,
  isLate,
  onToggleLate,
  onToggleInspectionItem,
  onToggleAllInspection,
  onOpenAddNote,
  onOpenAddPhoto,
  onSelectPhoto,
  onSaveDiagnosis,
  onAdvanceToDiagnosis,
  onPrepareQuotation,
  onSwitchTab,
  onAdvanceToQualityControl,
  onRegisterDelivery,
  onCloseOrder,
  onWarrantyReentry,
}) => {
  const { colors, typography, radius, shadows } = useTheme();

  const isEnDiagnostico = operationalStatus === OperationalStatus.EN_DIAGNOSTICO;
  const isEntregada = operationalStatus === OperationalStatus.ENTREGADA;
  const isCerrada = operationalStatus === OperationalStatus.CERRADA;

  const getPrimaryCta = () => {
    switch (operationalStatus) {
      case OperationalStatus.RECIBIDA:
        return { label: "Pasar a diagnóstico", action: onAdvanceToDiagnosis };
      case OperationalStatus.EN_DIAGNOSTICO:
        return { label: "Preparar cotización", action: onPrepareQuotation };
      case OperationalStatus.EN_ESPERA_COTIZACION:
        return { label: "Ir a cotización", action: () => onSwitchTab?.("cotizacion") };
      case OperationalStatus.EN_ESPERA_APROBACION:
        return { label: "Ver cotización por aprobar", action: () => onSwitchTab?.("cotizacion") };
      case OperationalStatus.EN_REPARACION:
        return { label: "Pasar a control de calidad", action: onAdvanceToQualityControl };
      case OperationalStatus.CONTROL_CALIDAD:
      case OperationalStatus.LISTA_PARA_ENTREGA:
        return { label: "Registrar entrega", action: onRegisterDelivery };
      default:
        return null;
    }
  };

  const cta = getPrimaryCta();

  return (
    <View style={styles.container}>
      <BayMotivoCard
        failureDescription={failureDescription}
        mileageIn={mileageIn}
        fuelLevel={fuelLevel}
        estimatedDelivery={estimatedDelivery}
      />

      <BayDiagnosisCard
        diagnosis={diagnosis}
        isEditable={isEnDiagnostico && !isCerrada}
        onSaveDiagnosis={onSaveDiagnosis}
      />

      <BayQuickInspectionCard
        inspection={quickInspection}
        onToggleItem={isCerrada ? () => {} : onToggleInspectionItem}
        onToggleAll={isCerrada ? undefined : onToggleAllInspection}
      />

      <BayPhotosCarousel
        photos={photos}
        onSelectPhoto={onSelectPhoto}
        onAddPhoto={isCerrada ? () => {} : onOpenAddPhoto}
      />

      {!isCerrada && (
        <View style={styles.actionsRow}>
          <TouchableOpacity
            onPress={onOpenAddNote}
            activeOpacity={0.8}
            style={[styles.actionButton, { backgroundColor: colors.surfaceCard, borderColor: colors.borderCard, borderRadius: radius.xl }, shadows.card]}
          >
            <FileText size={18} color={colors.brandPrimary} strokeWidth={2} />
            <Text style={[typography.buttonMd, styles.actionButtonText, { color: colors.brandPrimary }]}>
              Escribir nota
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onOpenAddPhoto}
            activeOpacity={0.8}
            style={[styles.actionButton, { backgroundColor: colors.surfaceCard, borderColor: colors.borderCard, borderRadius: radius.xl }, shadows.card]}
          >
            <Camera size={18} color={colors.brandPrimary} strokeWidth={2} />
            <Text style={[typography.buttonMd, styles.actionButtonText, { color: colors.brandPrimary }]}>
              Agregar foto
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {!isCerrada && (
        <View style={[styles.switchCard, { backgroundColor: colors.surfaceCard, borderColor: colors.borderCard, borderRadius: radius.xl }, shadows.card]}>
          <View style={styles.switchLeft}>
            <Clock size={16} color={colors.textSecondary} strokeWidth={2} />
            <Text style={[typography.bodyMd, styles.switchLabel, { color: colors.textSecondary }]}>
              Marcar con retraso
            </Text>
          </View>
          <View style={styles.switchRight}>
            <Switch value={isLate} onValueChange={onToggleLate} />
            <Text style={[typography.caption, { color: colors.textSecondary }]}>
              Orden retrasada
            </Text>
          </View>
        </View>
      )}

      <BayFollowUpSection notes={notes} onAddNote={isCerrada ? () => {} : onOpenAddNote} />

      {isEnDiagnostico && !isCerrada && (
        <View style={[styles.infoBanner, { backgroundColor: colors.surfaceTile, borderColor: colors.borderDashed, borderRadius: radius.xl }]}>
          <ShieldCheck size={18} color={colors.brandPrimary} strokeWidth={2} />
          <Text style={[typography.caption, styles.infoBannerText, { color: colors.textSecondary }]}>
            Avanza solo a la siguiente etapa. Cada cambio queda registrado.
          </Text>
        </View>
      )}

      {!isCerrada && !isEntregada && cta && (
        <TouchableOpacity
          onPress={cta.action}
          activeOpacity={0.85}
          style={[styles.primaryCta, { backgroundColor: colors.brandPrimary, borderRadius: radius.full }]}
        >
          <Text style={[typography.buttonMd, styles.primaryCtaText, { color: colors.textOnBrand }]}>
            {cta.label}
          </Text>
          <ArrowRight size={18} color={colors.textOnBrand} strokeWidth={2.4} />
        </TouchableOpacity>
      )}

      {!isCerrada && isEntregada && (
        <View style={styles.deliveryActions}>
          <TouchableOpacity
            onPress={onCloseOrder}
            activeOpacity={0.85}
            style={[styles.primaryCta, { backgroundColor: colors.brandPrimary, borderRadius: radius.full }]}
          >
            <Text style={[typography.buttonMd, styles.primaryCtaText, { color: colors.textOnBrand }]}>
              Cerrar orden
            </Text>
            <CheckCircle2 size={18} color={colors.textOnBrand} strokeWidth={2.4} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onWarrantyReentry}
            activeOpacity={0.8}
            style={[styles.secondaryCta, { backgroundColor: colors.surfaceCard, borderColor: colors.borderButton, borderRadius: radius.full }]}
          >
            <RotateCcw size={16} color={colors.textSecondary} strokeWidth={2.2} />
            <Text style={[typography.buttonMd, { color: colors.textSecondary, fontWeight: "600" }]}>
              Registrar reingreso por garantía
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: 16, paddingBottom: 24 },
  actionsRow: { flexDirection: "row", gap: 12 },
  actionButton: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 14, borderWidth: 1, gap: 8 },
  actionButtonText: { fontSize: 14, fontWeight: "600" },
  switchCard: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 14, paddingHorizontal: 16, borderWidth: 1 },
  switchLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  switchRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  switchLabel: { fontSize: 13 },
  infoBanner: { flexDirection: "row", alignItems: "center", gap: 10, padding: 14, borderWidth: 1, borderStyle: "dashed" },
  infoBannerText: { flex: 1, fontSize: 12.5, lineHeight: 18 },
  primaryCta: { flexDirection: "row", alignItems: "center", justifyContent: "center", height: 52, marginTop: 4, gap: 8 },
  primaryCtaText: { fontSize: 15, fontWeight: "700" },
  deliveryActions: { gap: 10, marginTop: 4 },
  secondaryCta: { flexDirection: "row", alignItems: "center", justifyContent: "center", height: 50, borderWidth: 1, gap: 8 },
});
