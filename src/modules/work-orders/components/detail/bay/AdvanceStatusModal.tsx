import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ArrowRight } from "lucide-react-native";
import { useTheme } from "@/theme";

export interface AdvanceStatusModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const AdvanceStatusModal: React.FC<AdvanceStatusModalProps> = ({
  visible,
  onClose,
  onConfirm,
}) => {
  const { colors, typography, radius } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.overlay,
          { backgroundColor: colors.overlayScrim },
        ]}
      >
        <View
          style={[
            styles.dialog,
            {
              backgroundColor: colors.surfaceCard,
              borderRadius: radius.xl,
              borderColor: colors.borderCard,
            },
          ]}
        >
          <Text
            style={[
              typography.headingMd,
              styles.title,
              { color: colors.textStrong },
            ]}
          >
            Pasar a diagnóstico
          </Text>

          <Text
            style={[
              typography.bodyMd,
              styles.description,
              { color: colors.textSecondary },
            ]}
          >
            ¿Deseas iniciar el diagnóstico técnico de este vehículo? La orden
            avanzará a la etapa &ldquo;En diagnóstico&rdquo;.
          </Text>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.7}
              style={[
                styles.cancelButton,
                {
                  borderColor: colors.borderButton,
                  borderRadius: radius.xl,
                },
              ]}
            >
              <Text
                style={[
                  typography.buttonMd,
                  { color: colors.textSecondary },
                ]}
              >
                Cancelar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                onConfirm();
                onClose();
              }}
              activeOpacity={0.8}
              style={[
                styles.confirmButton,
                {
                  backgroundColor: colors.brandPrimary,
                  borderRadius: radius.xl,
                },
              ]}
            >
              <Text
                style={[
                  typography.buttonMd,
                  styles.confirmButtonText,
                  { color: colors.textOnBrand },
                ]}
              >
                Iniciar diagnóstico
              </Text>
              <ArrowRight
                size={16}
                color={colors.textOnBrand}
                strokeWidth={2.4}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  dialog: {
    width: "100%",
    padding: 24,
    borderWidth: 1,
    gap: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  confirmButton: {
    flex: 1.3,
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  confirmButtonText: {
    fontSize: 13,
    fontWeight: "700",
  },
});
