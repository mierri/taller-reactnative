import { useTheme } from "@/theme";
import { Check, X } from "lucide-react-native";
import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export interface CloseOrderSheetProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  orderFolio?: string;
  vehicleName?: string;
}

export const CloseOrderSheet: React.FC<CloseOrderSheetProps> = ({
  visible,
  onClose,
  onConfirm,
  orderFolio = "OT-1049",
  vehicleName = "Nissan Versa",
}) => {
  const { colors, typography, radius } = useTheme();

  const handleConfirm = () => {
    onConfirm();
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
              Cerrar orden
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
            Confirma el cierre definitivo de la orden de trabajo. Una vez cerrada, quedará inmutable en el historial.
          </Text>

          <View
            style={[
              styles.infoCard,
              {
                backgroundColor: colors.surfaceCard,
                borderColor: colors.borderCard,
                borderRadius: radius.xl,
              },
            ]}
          >
            <Text style={[typography.bodyMd, { color: colors.textStrong, fontWeight: "600" }]}>
              {orderFolio} · {vehicleName}
            </Text>
            <View style={styles.badgeRow}>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: colors.statusActiveBg,
                    borderColor: colors.statusActiveBorder,
                    borderRadius: radius.full,
                  },
                ]}
              >
                <Text
                  style={[
                    typography.caption,
                    { color: colors.statusActiveFg, fontWeight: "600" },
                  ]}
                >
                  Entregada y liquidada
                </Text>
              </View>
            </View>
          </View>

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
    gap: 16,
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
  infoCard: {
    padding: 16,
    borderWidth: 1,
    gap: 8,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
  },
  confirmBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 52,
    gap: 8,
    marginTop: 4,
  },
  confirmBtnText: {
    fontWeight: "700",
    fontSize: 15,
  },
});

