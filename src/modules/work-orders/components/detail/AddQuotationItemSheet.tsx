import { useTheme } from "@/theme";
import { Check, ChevronDown, Search, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from "react-native";
import { QuotationItemType } from "../../types/work-order-detail.types";
import { CatalogSearchView } from "./CatalogSearchView";

export interface AddQuotationItemSheetProps {
  visible: boolean;
  onClose: () => void;
  onSaveItem: (item: {
    type: QuotationItemType;
    concept: string;
    unitPrice: number;
    quantity: number;
  }) => void;
}

export const AddQuotationItemSheet: React.FC<AddQuotationItemSheetProps> = ({
  visible,
  onClose,
  onSaveItem,
}) => {
  const { colors, typography, radius } = useTheme();
  const { height: screenHeight } = useWindowDimensions();
  const catalogHeight = Math.round(screenHeight * 0.75);

  const [type, setType] = useState<QuotationItemType>("LABOR");
  const [concept, setConcept] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  const handleSelectCatalogItem = (item: { concept: string; price: number }) => {
    setConcept(item.concept);
    if (item.price > 0) {
      setUnitPrice(item.price.toString());
    }
    setIsCatalogOpen(false);
  };

  const handleClose = () => {
    setIsCatalogOpen(false);
    onClose();
  };

  const handleSave = () => {
    const parsedPrice = parseFloat(unitPrice);
    const parsedQty = parseInt(quantity, 10);
    if (
      !concept.trim() ||
      isNaN(parsedPrice) ||
      parsedPrice <= 0 ||
      isNaN(parsedQty) ||
      parsedQty <= 0
    )
      return;
    onSaveItem({
      type,
      concept: concept.trim(),
      unitPrice: parsedPrice,
      quantity: parsedQty,
    });
    setConcept("");
    setUnitPrice("");
    setQuantity("1");
    setIsCatalogOpen(false);
    onClose();
  };

  const isValid =
    concept.trim().length > 0 &&
    parseFloat(unitPrice) > 0 &&
    parseInt(quantity, 10) > 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View
          style={[styles.backdrop, { backgroundColor: colors.overlayScrim }]}
        >
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              style={[
                styles.sheet,
                {
                  backgroundColor: colors.surfaceSheet,
                  borderTopLeftRadius: radius.sheet,
                  borderTopRightRadius: radius.sheet,
                  height: isCatalogOpen ? catalogHeight : undefined,
                  maxHeight: isCatalogOpen
                    ? catalogHeight
                    : Math.round(screenHeight * 0.88),
                },
              ]}
            >
              <View style={styles.handleContainer}>
                <View
                  style={[
                    styles.handleBar,
                    { backgroundColor: colors.borderGrabber },
                  ]}
                />
              </View>

              {isCatalogOpen ? (
                <CatalogSearchView
                  type={type}
                  onSelect={handleSelectCatalogItem}
                  onBack={() => setIsCatalogOpen(false)}
                />
              ) : (
                <>
                  <View style={styles.header}>
                    <Text
                      style={[
                        typography.headingMd,
                        styles.title,
                        { color: colors.textStrong },
                      ]}
                    >
                      Agregar servicio o refacción
                    </Text>
                    <TouchableOpacity
                      onPress={handleClose}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <X size={20} color={colors.textSecondary} />
                    </TouchableOpacity>
                  </View>

                  <ScrollView
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                  >
                    <View style={styles.segmentRow}>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => setType("LABOR")}
                        style={[
                          styles.segmentButton,
                          {
                            borderRadius: radius.md,
                            borderColor:
                              type === "LABOR"
                                ? colors.brandPrimary
                                : colors.borderInput,
                            backgroundColor:
                              type === "LABOR"
                                ? colors.statusActiveBg
                                : colors.surfaceInput,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            typography.captionMedium,
                            {
                              color:
                                type === "LABOR"
                                  ? colors.statusActiveFg
                                  : colors.textSecondary,
                              fontWeight: type === "LABOR" ? "700" : "500",
                            },
                          ]}
                        >
                          Mano de obra
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => setType("PART")}
                        style={[
                          styles.segmentButton,
                          {
                            borderRadius: radius.md,
                            borderColor:
                              type === "PART"
                                ? colors.brandPrimary
                                : colors.borderInput,
                            backgroundColor:
                              type === "PART"
                                ? colors.statusActiveBg
                                : colors.surfaceInput,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            typography.captionMedium,
                            {
                              color:
                                type === "PART"
                                  ? colors.statusActiveFg
                                  : colors.textSecondary,
                              fontWeight: type === "PART" ? "700" : "500",
                            },
                          ]}
                        >
                          Refacción
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => setType("CONSUMABLE")}
                        style={[
                          styles.segmentButton,
                          {
                            borderRadius: radius.md,
                            borderColor:
                              type === "CONSUMABLE"
                                ? colors.brandPrimary
                                : colors.borderInput,
                            backgroundColor:
                              type === "CONSUMABLE"
                                ? colors.statusActiveBg
                                : colors.surfaceInput,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            typography.captionMedium,
                            {
                              color:
                                type === "CONSUMABLE"
                                  ? colors.statusActiveFg
                                  : colors.textSecondary,
                              fontWeight:
                                type === "CONSUMABLE" ? "700" : "500",
                            },
                          ]}
                        >
                          Consumibles
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.fieldGroup}>
                      <Text
                        style={[
                          typography.captionMedium,
                          { color: colors.textSecondary },
                        ]}
                      >
                        Elegir del catálogo · opcional
                      </Text>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => setIsCatalogOpen(true)}
                        style={[
                          styles.dropdownBox,
                          {
                            backgroundColor: colors.surfaceInput,
                            borderColor: colors.borderInput,
                            borderRadius: radius.lg,
                          },
                        ]}
                      >
                        <View style={styles.dropdownLeft}>
                          <Search size={16} color={colors.textMuted} />
                          <Text
                            style={[
                              typography.bodyMd,
                              {
                                color: concept
                                  ? colors.textStrong
                                  : colors.textMuted,
                                fontSize: 13.5,
                              },
                            ]}
                            numberOfLines={1}
                          >
                            {concept ||
                              (type === "LABOR"
                                ? "Buscar servicio en catálogo..."
                                : type === "CONSUMABLE"
                                  ? "Buscar consumible en catálogo..."
                                  : "Buscar refacción en catálogo...")}
                          </Text>
                        </View>
                        <ChevronDown size={18} color={colors.textSecondary} />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.fieldGroup}>
                      <Text
                        style={[
                          typography.captionMedium,
                          { color: colors.textSecondary },
                        ]}
                      >
                        Concepto
                      </Text>
                      <TextInput
                        value={concept}
                        onChangeText={setConcept}
                        placeholder={
                          type === "LABOR"
                            ? "Ej. Cambio de balatas delanteras"
                            : type === "CONSUMABLE"
                              ? "Ej. Aceite sintético 5W-30"
                              : "Ej. Filtro de aceite"
                        }
                        placeholderTextColor={colors.textPlaceholder}
                        style={[
                          styles.inputBox,
                          {
                            backgroundColor: colors.surfaceInput,
                            borderColor: colors.borderInput,
                            borderRadius: radius.lg,
                            color: colors.textStrong,
                          },
                        ]}
                      />
                    </View>

                    <View style={styles.row}>
                      <View style={[styles.fieldGroup, { flex: 1 }]}>
                        <Text
                          style={[
                            typography.captionMedium,
                            { color: colors.textSecondary },
                          ]}
                        >
                          Precio unitario · MXN
                        </Text>
                        <TextInput
                          keyboardType="numeric"
                          value={unitPrice}
                          onChangeText={setUnitPrice}
                          placeholder="0.00"
                          placeholderTextColor={colors.textPlaceholder}
                          style={[
                            styles.inputBox,
                            {
                              backgroundColor: colors.surfaceInput,
                              borderColor: colors.borderInput,
                              borderRadius: radius.lg,
                              color: colors.textStrong,
                            },
                          ]}
                        />
                      </View>

                      <View style={[styles.fieldGroup, { width: 100 }]}>
                        <Text
                          style={[
                            typography.captionMedium,
                            { color: colors.textSecondary },
                          ]}
                        >
                          Cantidad
                        </Text>
                        <TextInput
                          keyboardType="numeric"
                          value={quantity}
                          onChangeText={setQuantity}
                          placeholder="1"
                          placeholderTextColor={colors.textPlaceholder}
                          style={[
                            styles.inputBox,
                            {
                              backgroundColor: colors.surfaceInput,
                              borderColor: colors.borderInput,
                              borderRadius: radius.lg,
                              color: colors.textStrong,
                              textAlign: "center",
                            },
                          ]}
                        />
                      </View>
                    </View>

                    <Text
                      style={[
                        typography.caption,
                        styles.helperText,
                        { color: colors.textMuted },
                      ]}
                    >
                      Las refacciones del catálogo se descuentan del almacén al
                      marcar el trabajo como realizado. Las herramientas no se
                      cobran.
                    </Text>

                    <TouchableOpacity
                      activeOpacity={0.85}
                      disabled={!isValid}
                      onPress={handleSave}
                      style={[
                        styles.submitButton,
                        {
                          backgroundColor: isValid
                            ? colors.brandPrimary
                            : colors.borderControl,
                          borderRadius: radius.full,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          typography.buttonMd,
                          { color: colors.textOnBrand, fontSize: 14.5 },
                        ]}
                      >
                        Guardar servicio o refacción
                      </Text>
                      <Check
                        size={17}
                        color={colors.textOnBrand}
                        strokeWidth={2.4}
                      />
                    </TouchableOpacity>
                  </ScrollView>
                </>
              )}
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    maxHeight: "90%",
    paddingTop: 10,
    paddingBottom: Platform.OS === "ios" ? 36 : 24,
  },
  handleContainer: {
    alignItems: "center",
    paddingVertical: 6,
  },
  handleBar: {
    width: 44,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  title: {
    fontSize: 16.5,
    fontWeight: "700",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 24,
    gap: 14,
  },
  segmentRow: {
    flexDirection: "row",
    gap: 12,
  },
  segmentButton: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  fieldGroup: {
    gap: 6,
  },
  dropdownBox: {
    height: 48,
    borderWidth: 1,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
    marginRight: 8,
  },
  inputBox: {
    height: 48,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 14,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  helperText: {
    fontSize: 11.5,
    lineHeight: 16,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    marginTop: 8,
    gap: 6,
  },
});
