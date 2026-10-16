import { useTheme } from "@/theme";
import { X } from "lucide-react-native";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export interface RejectQuotationItemSheetProps {
  visible: boolean;
  itemId: string | null;
  onClose: () => void;
  onConfirmReject: (itemId: string, reason: string) => void;
}

const REJECTION_PRESETS = [
  "Presupuesto alto",
  "Lo haré después",
  "No lo considero necesario",
];

interface FormProps {
  itemId: string;
  onClose: () => void;
  onConfirmReject: (itemId: string, reason: string) => void;
}

const RejectQuotationItemForm: React.FC<FormProps> = ({
  itemId,
  onClose,
  onConfirmReject,
}) => {
  const { colors, typography, radius } = useTheme();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [customReason, setCustomReason] = useState("");

  const handleSelectPreset = (preset: string) => {
    setSelectedOption(preset);
    setCustomReason(preset);
  };

  const handleCustomChange = (val: string) => {
    setCustomReason(val);
    if (selectedOption && val !== selectedOption) {
      setSelectedOption(null);
    }
  };

  const finalReason = customReason.trim();
  const canConfirm = finalReason.length > 0;

  const handleConfirm = () => {
    if (!canConfirm) return;
    onConfirmReject(itemId, finalReason);
    onClose();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.backdrop, { backgroundColor: colors.overlayScrim }]}
    >
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
            ¿Por qué se rechaza?
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
            { color: colors.textMuted },
          ]}
        >
          El motivo se conserva con el concepto original.
        </Text>

        <View style={styles.presetsList}>
          {REJECTION_PRESETS.map((preset) => {
            const isSelected = selectedOption === preset;
            return (
              <TouchableOpacity
                key={preset}
                activeOpacity={0.75}
                onPress={() => handleSelectPreset(preset)}
                style={[
                  styles.presetBtn,
                  {
                    backgroundColor: isSelected
                      ? colors.statusDangerBg
                      : colors.surfaceCard,
                    borderColor: isSelected
                      ? colors.statusDangerBorder
                      : colors.borderButton,
                    borderRadius: radius.lg,
                  },
                ]}
              >
                <Text
                  style={[
                    typography.bodyLg,
                    {
                      color: isSelected
                        ? colors.statusDangerFg
                        : colors.textStrong,
                      fontWeight: isSelected ? "700" : "500",
                    },
                  ]}
                >
                  {preset}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.inputSection}>
          <Text
            style={[
              typography.labelLg,
              styles.inputLabel,
              { color: colors.textLabel },
            ]}
          >
            Motivo
          </Text>
          <TextInput
            value={customReason}
            onChangeText={handleCustomChange}
            placeholder="Selecciona o escribe otro motivo"
            placeholderTextColor={colors.textPlaceholder}
            style={[
              styles.textInput,
              {
                backgroundColor: colors.surfaceInput,
                borderColor: colors.borderInput,
                borderRadius: radius.lg,
                color: colors.textStrong,
              },
            ]}
          />
        </View>

        <TouchableOpacity
          activeOpacity={canConfirm ? 0.85 : 1}
          disabled={!canConfirm}
          onPress={handleConfirm}
          style={[
            styles.confirmBtn,
            {
              backgroundColor: canConfirm
                ? colors.brandPrimary
                : colors.borderControl,
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
            Confirmar rechazo
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export const RejectQuotationItemSheet: React.FC<
  RejectQuotationItemSheetProps
> = ({ visible, itemId, onClose, onConfirmReject }) => {
  if (!itemId) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <RejectQuotationItemForm
        key={itemId}
        itemId={itemId}
        onClose={onClose}
        onConfirmReject={onConfirmReject}
      />
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
    fontSize: 13,
    lineHeight: 18,
  },
  presetsList: {
    gap: 10,
  },
  presetBtn: {
    height: 48,
    borderWidth: 1,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  inputSection: {
    gap: 6,
    marginTop: 2,
  },
  inputLabel: {
    fontWeight: "600",
    fontSize: 13,
  },
  textInput: {
    height: 48,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 14,
  },
  confirmBtn: {
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  confirmBtnText: {
    fontWeight: "700",
    fontSize: 15,
  },
});
