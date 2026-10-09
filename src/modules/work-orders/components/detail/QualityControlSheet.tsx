import { useTheme } from "@/theme";
import { Check, RotateCcw, X } from "lucide-react-native";
import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export interface QualityControlSheetProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onReturnToRepair?: () => void;
}

export const QualityControlSheet: React.FC<QualityControlSheetProps> = ({
  visible,
  onClose,
  onConfirm,
  onReturnToRepair,
}) => {
  const { colors, typography, radius } = useTheme();

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleReturn = () => {
    onReturnToRepair?.();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.backdrop, { backgroundColor: colors.overlayScrim }]}>
        <TouchableOpacity
          style={styles.dismissOverlay}
          activeOpacity={1}
          onPress={onClose}
        />
        <View
          style={[
            styles.sheetContainer,
            {
              backgroundColor: colors.surfaceSheet,
              borderTopLeftRadius: radius.sheet,
              borderTopRightRadius: radius.sheet,
            },
          ]}
        >
          <View
            style={[
              styles.dragIndicator,
              { backgroundColor: colors.borderGrabber },
            ]}
          />

          <View style={styles.headerRow}>
            <Text
              style={[
                typography.headingMd,
                styles.title,
                { color: colors.textStrong },
              ]}
            >
              Aprobar control de calidad
            </Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text
            style={[
              typography.bodyMd,
              styles.subtitle,
              { color: colors.textSecondary },
            ]}
          >
            Confirma que los trabajos ejecutados cumplen con la revisión técnica.
          </Text>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleConfirm}
            style={[
              styles.confirmBtn,
              {
                backgroundColor: colors.brandPrimary,
                borderRadius: radius.xl,
              },
            ]}
          >
            <Text
              style={[
                typography.buttonMd,
                styles.confirmBtnText,
                { color: colors.textOnBrand },
              ]}
            >
              Confirmar
            </Text>
            <Check size={18} color={colors.textOnBrand} strokeWidth={2.4} />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleReturn}
            style={[
              styles.returnBtn,
              {
                backgroundColor: colors.surfaceCard,
                borderColor: colors.borderButton,
                borderRadius: radius.xl,
              },
            ]}
          >
            <RotateCcw size={16} color={colors.textSecondary} strokeWidth={2.2} />
            <Text
              style={[
                typography.buttonMd,
                { color: colors.textSecondary, fontWeight: "600" },
              ]}
            >
              Regresar a reparación
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
  },
  dismissOverlay: {
    flex: 1,
  },
  sheetContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 36,
    gap: 14,
  },
  dragIndicator: {
    width: 38,
    height: 4.5,
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 4,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  confirmBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 52,
    gap: 8,
    marginTop: 6,
  },
  confirmBtnText: {
    fontWeight: "700",
    fontSize: 15,
  },
  returnBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    borderWidth: 1,
    gap: 8,
  },
});

