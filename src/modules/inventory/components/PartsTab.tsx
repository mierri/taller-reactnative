import { EmptyState, SearchBar, Switch } from "@/components";
import { useTheme } from "@/theme";
import { ClipboardList } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { InventoryArticle } from "../types/inventory.types";
import { PartCard } from "./PartCard";

export interface PartsTabProps {
  articles: InventoryArticle[];
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onlyLowStock: boolean;
  onToggleLowStock: (val: boolean) => void;
  onOpenCreateSheet: () => void;
  onSelectArticle: (article: InventoryArticle) => void;
}

export const PartsTab: React.FC<PartsTabProps> = ({
  articles,
  searchQuery,
  onSearchChange,
  onlyLowStock,
  onToggleLowStock,
  onOpenCreateSheet,
  onSelectArticle,
}) => {
  const { colors, typography } = useTheme();

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={onSearchChange}
        placeholder="Buscar nombre, código o serie"
      />

      <View style={styles.filterRow}>
        <Switch value={onlyLowStock} onValueChange={onToggleLowStock} />
        <Text style={[typography.bodyMd, { color: colors.textSecondary }]}>
          Solo existencias bajas
        </Text>
      </View>

      {articles.length === 0 ? (
        onlyLowStock ? (
          <EmptyState
            icon={
              <ClipboardList
                size={32}
                color={colors.textMuted}
                strokeWidth={1.8}
              />
            }
            title="No hay faltantes"
            description="Las existencias están por encima del mínimo."
            actionLabel="Agregar registro"
            actionButtonType="PillCard"
            onActionPress={onOpenCreateSheet}
          />
        ) : (
          <EmptyState
            icon={
              <ClipboardList
                size={32}
                color={colors.textMuted}
                strokeWidth={1.8}
              />
            }
            title="Aún no hay refacciones"
            description="Agrega el primer registro para comenzar a llevar el control."
            actionLabel="Agregar registro"
            actionButtonType="PillCard"
            onActionPress={onOpenCreateSheet}
          />
        )
      ) : (
        <View style={styles.list}>
          {articles.map((item) => (
            <PartCard
              key={item.id}
              article={item}
              onPress={onSelectArticle}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  list: {
    gap: 12,
  },
});
