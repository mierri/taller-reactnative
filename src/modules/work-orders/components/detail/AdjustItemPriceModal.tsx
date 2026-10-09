import { useTheme } from "@/theme";
import { Check, X } from "lucide-react-native";
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
import { QuotationItem } from "../../types/work-order-detail.types";
import { formatCurrency } from "../../utils/detail-formatters";

export interface AdjustItemPriceModalProps {
  visible: boolean;
  item: QuotationItem | null;
  onClose: () => void;
  onSave: (itemId: string, quantity: number, unitPrice: number) => void;
}

interface FormContentProps {
  item: QuotationItem;
  onClose: () => void;
  onSave: (itemId: string, quantity: number, unitPrice: number) => void;
}

const AdjustItemPriceForm: React.FC<FormContentProps> = ({
  item,
  onClose,
  onSave,
}) => {
  const { colors, typography, radius } = useTheme();
  const [quantity, setQuantity] = useState(String(item.quantity));
  const [unitPrice, setUnitPrice] = useState(String(item.unitPrice));

  const parsedQty = Math.max(1, parseInt(quantity, 10) || 1);
  const parsedPrice = Math.max(0, parseFloat(unitPrice) || 0);
  const total = parsedQty * parsedPrice;

  const handleSave = () => {
    onSave(item.id, parsedQty, parsedPrice);
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
          <View style={styles.headerTextGroup}>
            <Text style={[typography.eyebrow, { color: colors.textMuted }]}>
              AJUSTAR CONCEPTO
            </Text>
            <Text
              style={[
                typography.titleCard,
                styles.title,
                { color: colors.textStrong },
              ]}
            >
              {item.concept}
            </Text>
          </View>
          <TouchableOpacity
            onPress={onClose}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <X size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.inputsRow}>
          <View style={styles.inputColSmall}>
            <Text
              style={[typography.captionMedium, { color: colors.textSecondary }]}
            >
              Cantidad
            </Text>
            <TextInput
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
              style={[
                styles.textInput,
                {
                  backgroundColor: colors.surfaceTile,
                  borderColor: colors.borderInput,
                  borderRadius: radius.lg,
                  color: colors.textStrong,
                },
              ]}
            />
          </View>

          <View style={styles.inputColLarge}>
            <Text
              style={[typography.captionMedium, { color: colors.textSecondary }]}
            >
              Precio unitario ($)
            </Text>
            <TextInput
              value={unitPrice}
              onChangeText={setUnitPrice}
              keyboardType="decimal-pad"
              style={[
                styles.textInput,
                {
                  backgroundColor: colors.surfaceTile,
                  borderColor: colors.borderInput,
                  borderRadius: radius.lg,
                  color: colors.textStrong,
                },
              ]}
            />
          </View>
        </View>

        <View
          style={[
            styles.totalRow,
            {
              backgroundColor: colors.surfaceTile,
              borderColor: colors.borderDivider,
              borderRadius: radius.lg,
            },
          ]}
        >
          <Text style={[typography.bodyMd, { color: colors.textSecondary }]}>
            Total ajustado
          </Text>
          <Text
            style={[
              typography.headingMd,
              { color: colors.brandPrimary, fontWeight: "700" },
            ]}
          >
            {formatCurrency(total)}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleSave}
          style={[
            styles.saveBtn,
            {
              backgroundColor: colors.brandPrimary,
              borderRadius: radius.xl,
            },
          ]}
        >
          <Check size={18} color={colors.textOnBrand} strokeWidth={2.2} />
          <Text
            style={[
              typography.buttonMd,
              { color: colors.textOnBrand, fontWeight: "700" },
            ]}
          >
            Guardar cambios
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export const AdjustItemPriceModal: React.FC<AdjustItemPriceModalProps> = ({
  visible,
  item,
  onClose,
  onSave,
}) => {
  if (!item) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <AdjustItemPriceForm
        key={item.id}
        item={item}
        onClose={onClose}
        onSave={onSave}
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
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  headerTextGroup: {
    flex: 1,
    gap: 2,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
  },
  inputsRow: {
    flexDirection: "row",
    gap: 12,
  },
  inputColSmall: {
    flex: 1,
    gap: 6,
  },
  inputColLarge: {
    flex: 2,
    gap: 6,
  },
  textInput: {
    height: 46,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 15,
  },
  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderWidth: 1,
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    gap: 8,
    marginTop: 4,
  },
});

