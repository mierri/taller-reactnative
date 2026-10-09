import { useTheme } from "@/theme";
import { ArrowLeft, Clock, Plus, Search, X } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  mockConsumablesCatalog,
  mockPartsCatalog,
  mockServicesCatalog,
} from "../../mocks/services-catalog.mock";
import {
  ALL_SERVICE_CATEGORIES,
  SERVICE_CATEGORY_LABELS,
  ServiceCategory,
  ServiceCatalogItem,
} from "../../types/services-catalog.types";
import { QuotationItemType } from "../../types/work-order-detail.types";
import { formatCurrency } from "../../utils/detail-formatters";

export interface CatalogSearchViewProps {
  type: QuotationItemType;
  onSelect: (item: { concept: string; price: number }) => void;
  onBack: () => void;
}

export const CatalogSearchView: React.FC<CatalogSearchViewProps> = ({
  type,
  onSelect,
  onBack,
}) => {
  const { colors, typography, radius } = useTheme();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const isLabor = type === "LABOR";
  const isConsumable = type === "CONSUMABLE";

  const nonLaborCategories = useMemo(() => {
    const set = new Set<string>();
    const list = isConsumable ? mockConsumablesCatalog : mockPartsCatalog;
    list.forEach((p) => set.add(p.category));
    return Array.from(set);
  }, [isConsumable]);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    const source = isLabor
      ? mockServicesCatalog
      : isConsumable
        ? mockConsumablesCatalog
        : mockPartsCatalog;
    return source.filter((item) => {
      const matchesCat =
        selectedCategory === "ALL" || item.category === selectedCategory;
      const matchesQuery =
        !q ||
        item.concept.toLowerCase().includes(q) ||
        item.system.toLowerCase().includes(q) ||
        (item.family && item.family.toLowerCase().includes(q)) ||
        (item.code && item.code.toLowerCase().includes(q));
      return matchesCat && matchesQuery;
    });
  }, [isLabor, isConsumable, query, selectedCategory]);

  const handlePickCustom = () => {
    if (!query.trim()) return;
    onSelect({ concept: query.trim(), price: 0 });
  };

  const catalogTitle = isLabor
    ? "Catálogo de servicios"
    : isConsumable
      ? "Catálogo de consumibles"
      : "Catálogo de refacciones";

  return (
    <View style={styles.container}>
      <View
        style={[styles.header, { borderBottomColor: colors.borderDivider }]}
      >
        <TouchableOpacity
          onPress={onBack}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.backButton}
        >
          <ArrowLeft size={18} color={colors.brandPrimary} />
          <Text
            style={[
              typography.captionMedium,
              { color: colors.brandPrimary, fontWeight: "600" },
            ]}
          >
            Volver
          </Text>
        </TouchableOpacity>
        <Text
          style={[
            typography.headingMd,
            styles.headerTitle,
            { color: colors.textStrong },
          ]}
        >
          {catalogTitle}
        </Text>
      </View>

      <View style={styles.searchSection}>
        <View
          style={[
            styles.searchBox,
            {
              backgroundColor: colors.surfaceInput,
              borderColor: colors.borderInput,
              borderRadius: radius.lg,
            },
          ]}
        >
          <Search size={18} color={colors.textMuted} />
          <TextInput
            autoFocus
            value={query}
            onChangeText={setQuery}
            placeholder="Buscar por concepto, sistema o familia..."
            placeholderTextColor={colors.textPlaceholder}
            style={[styles.searchInput, { color: colors.textStrong }]}
            autoCapitalize="none"
          />
          {query.length > 0 && Platform.OS !== "ios" && (
            <TouchableOpacity onPress={() => setQuery("")}>
              <X size={16} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.categoriesWrapper}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
          data={
            isLabor
              ? ["ALL", ...ALL_SERVICE_CATEGORIES]
              : ["ALL", ...nonLaborCategories]
          }
          keyExtractor={(item) => item}
          renderItem={({ item }) => {
            const isSelected = selectedCategory === item;
            const label =
              item === "ALL"
                ? "Todas"
                : isLabor
                  ? SERVICE_CATEGORY_LABELS[item as ServiceCategory] || item
                  : item;
            return (
              <TouchableOpacity
                onPress={() => setSelectedCategory(item)}
                activeOpacity={0.7}
                style={[
                  styles.categoryChip,
                  {
                    borderRadius: radius.full,
                    backgroundColor: isSelected
                      ? colors.brandPrimary
                      : colors.surfaceCard,
                    borderColor: isSelected
                      ? colors.brandPrimary
                      : colors.borderCard,
                  },
                ]}
              >
                <Text
                  style={[
                    typography.captionMedium,
                    {
                      color: isSelected
                        ? colors.textOnBrand
                        : colors.textSecondary,
                      fontWeight: isSelected ? "700" : "500",
                    },
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {query.trim().length > 0 && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handlePickCustom}
          style={[
            styles.customBar,
            {
              backgroundColor: colors.statusActiveBg,
              borderColor: colors.brandPrimary,
              borderRadius: radius.md,
            },
          ]}
        >
          <Plus size={16} color={colors.brandPrimary} strokeWidth={2.4} />
          <Text
            style={[
              typography.captionMedium,
              { color: colors.brandPrimary, flex: 1 },
            ]}
            numberOfLines={1}
          >
            {`Usar "${query.trim()}" como concepto personalizado`}
          </Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        style={styles.listFlex}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => {
          const service = item as ServiceCatalogItem;
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                onSelect({ concept: item.concept, price: item.basePrice })
              }
              style={[
                styles.card,
                {
                  backgroundColor: colors.surfaceCard,
                  borderColor: colors.borderCard,
                  borderRadius: radius.xl,
                },
              ]}
            >
              <View style={styles.cardHeader}>
                <View style={styles.tagsRow}>
                  <View
                    style={[
                      styles.badge,
                      {
                        backgroundColor: colors.statusActiveBg,
                        borderRadius: radius.sm,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        typography.caption,
                        {
                          color: colors.statusActiveFg,
                          fontSize: 10.5,
                          fontWeight: "600",
                        },
                      ]}
                    >
                      {isLabor
                        ? SERVICE_CATEGORY_LABELS[service.category] ||
                          service.category
                        : item.category}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.badge,
                      {
                        backgroundColor: colors.statusNeutralBg,
                        borderRadius: radius.sm,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        typography.caption,
                        { color: colors.statusNeutralFg, fontSize: 10.5 },
                      ]}
                    >
                      {item.system}
                    </Text>
                  </View>
                  {Boolean(item.family) && (
                    <View
                      style={[
                        styles.badge,
                        {
                          backgroundColor: colors.statusIndigoBg,
                          borderRadius: radius.sm,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          typography.caption,
                          { color: colors.statusIndigoFg, fontSize: 10.5 },
                        ]}
                      >
                        {item.family}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              <Text
                style={[
                  typography.bodyMd,
                  styles.cardTitle,
                  { color: colors.textStrong },
                ]}
              >
                {item.concept}
              </Text>

              <View style={styles.cardFooter}>
                <View style={styles.footerLeft}>
                  {Boolean(item.code) && (
                    <Text
                      style={[
                        typography.caption,
                        { color: colors.textMuted },
                      ]}
                    >
                      {item.code}
                    </Text>
                  )}
                  {Boolean(service.estimatedMinutes) && (
                    <View style={styles.timeRow}>
                      <Clock size={12} color={colors.textMuted} />
                      <Text
                        style={[
                          typography.caption,
                          { color: colors.textMuted },
                        ]}
                      >
                        {service.estimatedMinutes} min
                      </Text>
                    </View>
                  )}
                </View>
                <Text
                  style={[
                    typography.bodyMd,
                    { color: colors.brandPrimary, fontWeight: "700" },
                  ]}
                >
                  {formatCurrency(item.basePrice)}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text
              style={[
                typography.bodyMd,
                { color: colors.textSecondary, textAlign: "center" },
              ]}
            >
              {`No se encontraron resultados para "${query}"`}
            </Text>
            {query.trim().length > 0 && (
              <TouchableOpacity
                onPress={handlePickCustom}
                style={[
                  styles.emptyAddBtn,
                  {
                    backgroundColor: colors.brandPrimary,
                    borderRadius: radius.full,
                  },
                ]}
              >
                <Plus size={16} color={colors.textOnBrand} />
                <Text
                  style={[
                    typography.buttonMd,
                    { color: colors.textOnBrand },
                  ]}
                >
                  Escribir como concepto nuevo
                </Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  listFlex: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  backButton: { flexDirection: "row", alignItems: "center", gap: 4 },
  headerTitle: { fontSize: 15.5, fontWeight: "700" },
  searchSection: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 6 },
  searchBox: {
    height: 42,
    borderWidth: 1,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 13.5 },
  categoriesWrapper: { paddingBottom: 6 },
  categoriesList: { paddingHorizontal: 16, gap: 6 },
  categoryChip: { paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1 },
  customBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    gap: 6,
  },
  listContent: { paddingHorizontal: 16, paddingBottom: 24, gap: 8 },
  card: { borderWidth: 1, padding: 12, gap: 6 },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  badge: { paddingHorizontal: 6, paddingVertical: 2 },
  cardTitle: { fontSize: 14, fontWeight: "600", lineHeight: 18 },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 2,
  },
  footerLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  timeRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  emptyContainer: { padding: 24, alignItems: "center", gap: 12 },
  emptyAddBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 14,
    gap: 6,
  },
});
