import { BottomSheet, Button, Field } from "@/components";
import { useTheme } from "@/theme";
import { Check, ChevronDown } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  InventoryArticle,
  StockMovementItem,
  StockMovementType,
} from "../types/inventory.types";

export interface PartMovementSheetProps {
  visible: boolean;
  onClose: () => void;
  article: InventoryArticle | null;
  movements: StockMovementItem[];
  onSaveMovement: (
    articleId: string,
    type: StockMovementType,
    qty: number,
    reason?: string,
  ) => void;
  onEditArticle: (article: InventoryArticle) => void;
  onDeactivateArticle: (articleId: string) => void;
}

const movementTypeOptions: { key: StockMovementType; label: string }[] = [
  { key: "ENTRY", label: "Entrada" },
  { key: "EXIT", label: "Salida" },
  { key: "ADJUSTMENT", label: "Ajuste" },
];

export const PartMovementSheet: React.FC<PartMovementSheetProps> = ({
  visible,
  onClose,
  article,
  movements,
  onSaveMovement,
  onEditArticle,
  onDeactivateArticle,
}) => {
  const { colors, typography, radius } = useTheme();

  const [movementType, setMovementType] = useState<StockMovementType>("ENTRY");
  const [showTypeSelect, setShowTypeSelect] = useState(false);
  const [qtyStr, setQtyStr] = useState("");
  const [reason, setReason] = useState("");

  const qty = parseInt(qtyStr, 10) || 0;
  const isValid = qty > 0;

  const typeLabel = useMemo(() => {
    return movementTypeOptions.find((o) => o.key === movementType)?.label ?? "Entrada";
  }, [movementType]);

  const handleConfirmMovement = () => {
    if (!isValid || !article) return;
    onSaveMovement(article.id, movementType, qty, reason);
    handleClose();
  };

  const handleClose = () => {
    setMovementType("ENTRY");
    setShowTypeSelect(false);
    setQtyStr("");
    setReason("");
    onClose();
  };

  if (!article) return null;

  return (
    <BottomSheet
      visible={visible}
      onClose={handleClose}
      title={article.name}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={[typography.bodyMd, styles.subtitle, { color: colors.textSecondary }]}>
          {article.stock} disponibles · {article.sku}
        </Text>

        <View style={styles.section}>
          <Text style={[typography.captionMedium, styles.sectionTitle, { color: colors.textMuted }]}>
            MOVIMIENTOS DE ALMACÉN
          </Text>

          {movements.length === 0 ? (
            <Text style={[typography.bodyMd, { color: colors.textSecondary }]}>
              Sin movimientos registrados todavía.
            </Text>
          ) : (
            <View style={styles.movementsList}>
              {movements.slice(0, 3).map((m) => (
                <View
                  key={m.id}
                  style={[
                    styles.movementRow,
                    { borderBottomColor: colors.borderDivider },
                  ]}
                >
                  <View style={styles.movementCol}>
                    <Text
                      style={[typography.labelMd, { color: colors.textStrong }]}
                    >
                      {m.type === "ENTRY"
                        ? `+${m.qty} Entrada`
                        : m.type === "EXIT"
                          ? `-${m.qty} Salida`
                          : `Ajuste (${m.after} un)`}
                    </Text>
                    {m.reason ? (
                      <Text
                        style={[typography.caption, { color: colors.textMuted }]}
                      >
                        {m.reason}
                      </Text>
                    ) : null}
                  </View>
                  <Text
                    style={[typography.caption, { color: colors.textMuted }]}
                  >
                    {m.createdAt}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.pickerSection}>
          <Field
            type="Select"
            label="Tipo de movimiento"
            value={typeLabel}
            onPress={() => setShowTypeSelect((prev) => !prev)}
            trailingIcon={<ChevronDown size={20} color={colors.textMuted} />}
          />

          {showTypeSelect && (
            <View
              style={[
                styles.optionsList,
                {
                  backgroundColor: colors.surfaceCard,
                  borderColor: colors.borderInput,
                  borderRadius: radius.lg,
                },
              ]}
            >
              {movementTypeOptions.map((opt) => (
                <TouchableOpacity
                  key={opt.key}
                  onPress={() => {
                    setMovementType(opt.key);
                    setShowTypeSelect(false);
                  }}
                  activeOpacity={0.8}
                  style={[
                    styles.optionItem,
                    { borderBottomColor: colors.borderDivider },
                  ]}
                >
                  <Text
                    style={[
                      typography.bodyMd,
                      {
                        color:
                          movementType === opt.key
                            ? colors.brandPrimary
                            : colors.textStrong,
                        fontWeight: movementType === opt.key ? "700" : "400",
                      },
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <Field
          label="Cantidad"
          placeholder="0"
          value={qtyStr}
          onChangeText={setQtyStr}
          keyboardType="numeric"
        />

        <Field
          label="Motivo del movimiento"
          placeholder="Ej. Compra de stock, merma o uso"
          value={reason}
          onChangeText={setReason}
        />

        <Button
          type="Primary"
          label="Guardar movimiento"
          fullWidth
          disabled={!isValid}
          onPress={handleConfirmMovement}
          iconTrailing={
            <Check
              size={18}
              color={isValid ? colors.textOnBrand : colors.textMuted}
              strokeWidth={2.5}
            />
          }
        />

        <Button
          type="Secondary"
          label="Editar datos de la refacción"
          fullWidth
          onPress={() => {
            handleClose();
            onEditArticle(article);
          }}
        />

        <TouchableOpacity
          onPress={() => {
            handleClose();
            onDeactivateArticle(article.id);
          }}
          activeOpacity={0.7}
          style={styles.deleteButton}
        >
          <Text
            style={[
              typography.labelMd,
              { color: colors.statusDangerFg, textAlign: "center" },
            ]}
          >
            Desactivar artículo
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingBottom: 24,
  },
  subtitle: {
    marginTop: -8,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    letterSpacing: 0.5,
  },
  movementsList: {
    gap: 6,
  },
  movementRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  movementCol: {
    flex: 1,
    gap: 2,
  },
  pickerSection: {
    position: "relative",
    zIndex: 10,
  },
  optionsList: {
    borderWidth: 1,
    overflow: "hidden",
    marginTop: 8,
  },
  optionItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  deleteButton: {
    paddingVertical: 12,
    alignItems: "center",
  },
});

