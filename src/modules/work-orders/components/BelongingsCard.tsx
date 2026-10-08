import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Plus, X } from "lucide-react-native";
import { Checkbox } from "@/components";
import { useTheme } from "@/theme";

export interface BelongingItem {
  id: string;
  name: string;
  checked: boolean;
}

export interface BelongingsCardProps {
  items: BelongingItem[];
  onToggleItem: (id: string) => void;
  onAddItem: (name: string) => void;
  onRemoveItem: (id: string) => void;
}

export const BelongingsCard: React.FC<BelongingsCardProps> = ({
  items,
  onToggleItem,
  onAddItem,
  onRemoveItem,
}) => {
  const { colors, radius, typography } = useTheme();
  const [inputText, setInputText] = useState("");

  const handleAdd = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    onAddItem(trimmed);
    setInputText("");
  };

  const checkedCount = items.filter((i) => i.checked).length;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surfaceInput,
          borderColor: colors.borderInput,
          borderRadius: radius.xl,
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={[typography.labelLg, { color: colors.textLabel }]}>
          Pertenencias recibidas
        </Text>
        <View
          style={[
            styles.badge,
            {
              backgroundColor: colors.surfaceTile,
              borderRadius: radius.full,
            },
          ]}
        >
          <Text
            style={[
              typography.captionMedium,
              { color: colors.brandPrimaryText },
            ]}
          >
            {checkedCount} de {items.length}
          </Text>
        </View>
      </View>

      <View style={styles.inputRow}>
        <View
          style={[
            styles.inputWrapper,
            {
              backgroundColor: colors.surfaceApp,
              borderColor: colors.borderInput,
              borderRadius: radius.md,
            },
          ]}
        >
          <TextInput
            placeholder="Ej. Llaves, póliza, gato..."
            placeholderTextColor={colors.textPlaceholder}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleAdd}
            returnKeyType="done"
            style={[
              styles.input,
              typography.bodyMd,
              { color: colors.textStrong },
            ]}
          />
        </View>
        <Pressable
          onPress={handleAdd}
          style={({ pressed }) => [
            styles.addButton,
            {
              backgroundColor: colors.brandPrimary,
              borderRadius: radius.md,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <Plus size={20} color="#ffffff" strokeWidth={2.5} />
        </Pressable>
      </View>

      <View style={styles.list}>
        {items.length === 0 ? (
          <Text style={[typography.caption, { color: colors.textMuted }]}>
            No se han registrado pertenencias. Agrega una arriba.
          </Text>
        ) : (
          items.map((item) => (
            <View
              key={item.id}
              style={[
                styles.itemRow,
                {
                  borderBottomColor: colors.borderDivider,
                },
              ]}
            >
              <Checkbox
                checked={item.checked}
                onCheckedChange={() => onToggleItem(item.id)}
                label={item.name}
                style={styles.checkbox}
              />
              <Pressable
                onPress={() => onRemoveItem(item.id)}
                hitSlop={8}
                style={styles.deleteButton}
              >
                <X size={16} color={colors.textMuted} />
              </Pressable>
            </View>
          ))
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    padding: 16,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  inputRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  inputWrapper: {
    flex: 1,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  input: {
    padding: 0,
    height: "100%",
  },
  addButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    gap: 4,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  checkbox: {
    flex: 1,
  },
  deleteButton: {
    padding: 6,
  },
});
