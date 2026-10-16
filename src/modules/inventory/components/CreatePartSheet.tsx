import { BottomSheet, Button, Field } from "@/components";
import { SupplierSearchDropdown } from "@/modules/finance/components/SupplierSearchDropdown";
import { getMockSuppliers } from "@/modules/finance/mocks/finance.mock";
import { SupplierOption } from "@/modules/finance/types/finance.types";
import { useTheme } from "@/theme";
import { Check, ChevronDown, X } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ArticleType,
  CreateArticleInput,
  InventoryArticle,
} from "../types/inventory.types";

export interface CreatePartSheetProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: CreateArticleInput) => void;
  initialArticle?: InventoryArticle | null;
  onUpdate?: (id: string, data: CreateArticleInput) => void;
}

const typeOptions: { key: ArticleType; label: string }[] = [
  { key: "PARTE_EN_VENTA", label: "Refacción" },
  { key: "CONSUMIBLE", label: "Consumible" },
];

interface FormProps {
  initialArticle?: InventoryArticle | null;
  onClose: () => void;
  onSave: (data: CreateArticleInput) => void;
  onUpdate?: (id: string, data: CreateArticleInput) => void;
}

const CreatePartForm: React.FC<FormProps> = ({
  initialArticle,
  onClose,
  onSave,
  onUpdate,
}) => {
  const { colors, typography, radius } = useTheme();
  const allSuppliers = useMemo(() => getMockSuppliers(), []);

  const [name, setName] = useState(() => initialArticle?.name ?? "");
  const [sku, setSku] = useState(() => initialArticle?.sku ?? "");
  const [brand, setBrand] = useState(() => initialArticle?.brand ?? "");
  const [type, setType] = useState<ArticleType>(
    () => initialArticle?.type ?? "PARTE_EN_VENTA",
  );
  const [showTypePicker, setShowTypePicker] = useState(false);

  const [selectedSupplier, setSelectedSupplier] = useState<SupplierOption | null>(
    () => {
      if (initialArticle?.supplierId) {
        return {
          id: initialArticle.supplierId,
          name: initialArticle.supplierName || "Proveedor",
        };
      }
      return null;
    },
  );
  const [supplierQuery, setSupplierQuery] = useState(
    () => initialArticle?.supplierName ?? "",
  );
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);

  const [location, setLocation] = useState(() => initialArticle?.location ?? "");
  const [minStockStr, setMinStockStr] = useState(
    () => initialArticle?.minStock.toString() ?? "1",
  );
  const [purchasePriceStr, setPurchasePriceStr] = useState(
    () => initialArticle?.purchasePrice.toString() ?? "0",
  );
  const [salePriceStr, setSalePriceStr] = useState(
    () => initialArticle?.salePrice.toString() ?? "0",
  );

  const filteredSuppliers = useMemo(() => {
    const trimmed = supplierQuery.trim().toLowerCase();
    if (!trimmed) {
      return allSuppliers.slice(0, 3);
    }
    return allSuppliers.filter((s) => s.name.toLowerCase().includes(trimmed));
  }, [allSuppliers, supplierQuery]);

  const minStock = parseInt(minStockStr, 10) || 0;
  const purchasePrice = parseFloat(purchasePriceStr) || 0;
  const salePrice = parseFloat(salePriceStr) || 0;

  const isValid =
    name.trim().length >= 2 &&
    minStock >= 0 &&
    (type === "CONSUMIBLE" || salePrice >= 0);

  const handleSupplierQueryChange = (val: string) => {
    setSupplierQuery(val);
    setShowSupplierDropdown(true);
    if (selectedSupplier && selectedSupplier.name !== val) {
      setSelectedSupplier(null);
    }
  };

  const handleSelectSupplier = (supplier: SupplierOption) => {
    setSelectedSupplier(supplier);
    setSupplierQuery(supplier.name);
    setShowSupplierDropdown(false);
  };

  const handleClearSupplier = () => {
    setSelectedSupplier(null);
    setSupplierQuery("");
    setShowSupplierDropdown(false);
  };

  const handleSubmit = () => {
    if (!isValid) return;

    const payload: CreateArticleInput = {
      name: name.trim(),
      sku: sku.trim() || undefined,
      brand: brand.trim() || undefined,
      type,
      supplierId: selectedSupplier?.id,
      supplierName: selectedSupplier?.name,
      location: location.trim() || undefined,
      minStock,
      purchasePrice,
      salePrice,
    };

    if (initialArticle && onUpdate) {
      onUpdate(initialArticle.id, payload);
    } else {
      onSave(payload);
    }

    onClose();
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Field
        label="Nombre"
        placeholder="Ingresa el nombre"
        value={name}
        onChangeText={setName}
      />

      <Field
        label="Código interno"
        placeholder="Ingresa el código"
        value={sku}
        onChangeText={setSku}
      />

      <Field
        label="Marca"
        placeholder="Ingresa la marca"
        value={brand}
        onChangeText={setBrand}
      />

      <View style={styles.pickerSection}>
        <Field
          type="Select"
          label="Tipo"
          value={type === "PARTE_EN_VENTA" ? "Refacción" : "Consumible"}
          onPress={() => setShowTypePicker((prev) => !prev)}
          trailingIcon={<ChevronDown size={20} color={colors.textMuted} />}
        />

        {showTypePicker && (
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
            {typeOptions.map((opt) => (
              <TouchableOpacity
                key={opt.key}
                onPress={() => {
                  setType(opt.key);
                  setShowTypePicker(false);
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
                        type === opt.key
                          ? colors.brandPrimary
                          : colors.textStrong,
                      fontWeight: type === opt.key ? "700" : "400",
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

      <View style={styles.pickerSection}>
        <Field
          label="Proveedor"
          placeholder="Selecciona una opción (opcional)"
          value={supplierQuery}
          onChangeText={handleSupplierQueryChange}
          onFocus={() => setShowSupplierDropdown(true)}
          trailingIcon={
            selectedSupplier ? (
              <Pressable onPress={handleClearSupplier} hitSlop={8}>
                <X size={18} color={colors.textMuted} />
              </Pressable>
            ) : (
              <Pressable
                onPress={() => setShowSupplierDropdown((prev) => !prev)}
                hitSlop={8}
              >
                <ChevronDown size={20} color={colors.textMuted} />
              </Pressable>
            )
          }
        />
        <SupplierSearchDropdown
          results={filteredSuppliers}
          onSelect={handleSelectSupplier}
          visible={showSupplierDropdown}
        />
      </View>

      <Field
        label="Ubicación en almacén"
        placeholder="Ej. A-01, Pasillo 2"
        value={location}
        onChangeText={setLocation}
      />

      <Field
        label="Existencia mínima"
        placeholder="1"
        value={minStockStr}
        onChangeText={setMinStockStr}
        keyboardType="numeric"
      />

      <Field
        label="Costo de compra · MXN"
        placeholder="0"
        value={purchasePriceStr}
        onChangeText={setPurchasePriceStr}
        keyboardType="decimal-pad"
      />

      <Field
        label="Precio de venta · MXN"
        placeholder="0"
        value={salePriceStr}
        onChangeText={setSalePriceStr}
        keyboardType="decimal-pad"
        helper="Obligatorio para refacciones. Los consumibles son de uso interno."
      />

      <Button
        type="Primary"
        label="Guardar cambios"
        fullWidth
        disabled={!isValid}
        onPress={handleSubmit}
        iconTrailing={
          <Check
            size={18}
            color={isValid ? colors.textOnBrand : colors.textMuted}
            strokeWidth={2.5}
          />
        }
      />
    </ScrollView>
  );
};

export const CreatePartSheet: React.FC<CreatePartSheetProps> = ({
  visible,
  onClose,
  onSave,
  initialArticle,
  onUpdate,
}) => {
  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Refacción o consumible"
    >
      <CreatePartForm
        key={initialArticle?.id ?? "new"}
        initialArticle={initialArticle}
        onClose={onClose}
        onSave={onSave}
        onUpdate={onUpdate}
      />
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingBottom: 24,
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
});
