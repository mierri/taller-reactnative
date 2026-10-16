import { AppHeader, EmptyState } from "@/components";
import { useTheme } from "@/theme";
import { Plus, Wrench } from "lucide-react-native";
import React, { useCallback, useMemo, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CreatePartSheet, PartMovementSheet, PartsTab } from "../components";
import {
  addMockArticle,
  deactivateMockArticle,
  getMockArticles,
  getMockMovements,
  registerMockMovement,
  updateMockArticle,
} from "../mocks/inventory.mock";
import {
  CreateArticleInput,
  InventoryArticle,
  InventoryTabKey,
  StockMovementType,
} from "../types/inventory.types";

const tabsList: { key: InventoryTabKey; label: string }[] = [
  { key: "parts", label: "Refacciones" },
  { key: "tools", label: "Herramientas" },
  { key: "custody", label: "Resguardo" },
];

export const InventoryScreen: React.FC = () => {
  const { colors, typography, layout, radius, space, shadows } = useTheme();

  const [activeTab, setActiveTab] = useState<InventoryTabKey>("parts");
  const [searchQuery, setSearchQuery] = useState("");
  const [onlyLowStock, setOnlyLowStock] = useState(false);
  const [showCreateSheet, setShowCreateSheet] = useState(false);

  const [selectedArticle, setSelectedArticle] =
    useState<InventoryArticle | null>(null);
  const [showMovementSheet, setShowMovementSheet] = useState(false);

  const [editingArticle, setEditingArticle] =
    useState<InventoryArticle | null>(null);
  const [showEditSheet, setShowEditSheet] = useState(false);

  const [articlesStore, setArticlesStore] = useState<InventoryArticle[]>(() =>
    getMockArticles(false, ""),
  );

  const filteredArticles = useMemo(() => {
    let list = [...articlesStore];

    if (onlyLowStock) {
      list = list.filter((a) => a.stock <= a.minStock);
    }

    const query = searchQuery.trim().toLowerCase();
    if (query) {
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(query) ||
          a.sku.toLowerCase().includes(query) ||
          (a.location && a.location.toLowerCase().includes(query)) ||
          (a.brand && a.brand.toLowerCase().includes(query)),
      );
    }

    return list;
  }, [articlesStore, onlyLowStock, searchQuery]);

  const activeMovements = useMemo(() => {
    if (!selectedArticle) return [];
    return getMockMovements(selectedArticle.id);
  }, [selectedArticle, articlesStore]);

  const handleSaveArticle = useCallback((input: CreateArticleInput) => {
    const created = addMockArticle(input);
    setArticlesStore(getMockArticles(false, ""));
  }, []);

  const handleUpdateArticle = useCallback(
    (id: string, input: CreateArticleInput) => {
      updateMockArticle(id, input);
      setArticlesStore(getMockArticles(false, ""));
      setShowEditSheet(false);
      setEditingArticle(null);
    },
    [],
  );

  const handleSelectArticle = useCallback((article: InventoryArticle) => {
    setSelectedArticle(article);
    setShowMovementSheet(true);
  }, []);

  const handleSaveMovement = useCallback(
    (
      articleId: string,
      type: StockMovementType,
      qty: number,
      reason?: string,
    ) => {
      registerMockMovement(articleId, type, qty, reason);
      const updatedList = getMockArticles(false, "");
      setArticlesStore(updatedList);
      setShowMovementSheet(false);
      setSelectedArticle(null);
    },
    [],
  );

  const handleStartEdit = useCallback((article: InventoryArticle) => {
    setShowMovementSheet(false);
    setSelectedArticle(null);
    setEditingArticle(article);
    setShowEditSheet(true);
  }, []);

  const handleDeactivate = useCallback((articleId: string) => {
    deactivateMockArticle(articleId);
    setArticlesStore(getMockArticles(false, ""));
    setShowMovementSheet(false);
    setSelectedArticle(null);
  }, []);

  return (
    <View style={[styles.screen, { backgroundColor: colors.surfaceApp }]}>
      <AppHeader type="Home" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          {
            paddingHorizontal: layout.margin,
            paddingBottom: Platform.OS === "ios" ? 170 : 120,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerBlock}>
          <View style={styles.titleAndActionRow}>
            <View style={styles.titleCol}>
              <Text style={[typography.eyebrow, { color: colors.textMuted }]}>
                LO QUE TU TALLER NECESITA
              </Text>
              <Text
                style={[typography.headingXl, { color: colors.textStrong }]}
              >
                Almacén y equipo.
              </Text>
              <Text
                style={[typography.bodyMd, { color: colors.textSecondary }]}
              >
                Refacciones para trabajar. Herramientas para cuidar.
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => setShowCreateSheet(true)}
              activeOpacity={0.85}
              style={[
                styles.addHeaderButton,
                {
                  backgroundColor: colors.brandPrimary,
                  borderRadius: radius.full,
                },
                shadows.button,
              ]}
            >
              <Plus size={22} color={colors.textOnBrand} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={[
            styles.segmentedBar,
            {
              backgroundColor: colors.surfaceTile,
              borderRadius: radius.lg,
            },
          ]}
        >
          {tabsList.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                activeOpacity={0.8}
                style={[
                  styles.tabItem,
                  isActive && [
                    styles.tabItemActive,
                    {
                      backgroundColor: colors.surfaceCard,
                      borderRadius: radius.md,
                    },
                    shadows.card,
                  ],
                ]}
              >
                <Text
                  style={[
                    typography.captionMedium,
                    {
                      color: isActive
                        ? colors.brandPrimary
                        : colors.textSecondary,
                    },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {activeTab === "parts" && (
          <PartsTab
            articles={filteredArticles}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onlyLowStock={onlyLowStock}
            onToggleLowStock={setOnlyLowStock}
            onOpenCreateSheet={() => setShowCreateSheet(true)}
            onSelectArticle={handleSelectArticle}
          />
        )}

        {activeTab === "tools" && (
          <EmptyState
            icon={
              <Wrench size={32} color={colors.textMuted} strokeWidth={1.8} />
            }
            title="Herramientas del taller"
            description="El inventario y control de herramientas se habilitará próximamente."
          />
        )}

        {activeTab === "custody" && (
          <EmptyState
            icon={
              <Wrench size={32} color={colors.textMuted} strokeWidth={1.8} />
            }
            title="Piezas en resguardo"
            description="El control de piezas y pertenencias de clientes se habilitará próximamente."
          />
        )}
      </ScrollView>

      <CreatePartSheet
        visible={showCreateSheet}
        onClose={() => setShowCreateSheet(false)}
        onSave={handleSaveArticle}
      />

      <CreatePartSheet
        visible={showEditSheet}
        initialArticle={editingArticle}
        onClose={() => {
          setShowEditSheet(false);
          setEditingArticle(null);
        }}
        onSave={handleSaveArticle}
        onUpdate={handleUpdateArticle}
      />

      <PartMovementSheet
        visible={showMovementSheet}
        article={selectedArticle}
        movements={activeMovements}
        onClose={() => {
          setShowMovementSheet(false);
          setSelectedArticle(null);
        }}
        onSaveMovement={handleSaveMovement}
        onEditArticle={handleStartEdit}
        onDeactivateArticle={handleDeactivate}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scrollView: { flex: 1 },
  contentContainer: { paddingTop: 16, gap: 20 },
  headerBlock: { gap: 4 },
  titleAndActionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  titleCol: {
    flex: 1,
    gap: 4,
  },
  addHeaderButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  segmentedBar: { flexDirection: "row", padding: 4, alignItems: "center" },
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  tabItemActive: { elevation: 2 },
});
