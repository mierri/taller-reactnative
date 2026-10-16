import {
  CreateArticleInput,
  InventoryArticle,
  StockMovementItem,
  StockMovementType,
} from "../types/inventory.types";

export const initialArticles: InventoryArticle[] = [
  {
    id: "art-1",
    name: "Filtro de aceite",
    sku: "FIL-001",
    brand: "Fram",
    type: "PARTE_EN_VENTA",
    location: "A-01",
    minStock: 5,
    stock: 12,
    purchasePrice: 85,
    salePrice: 150,
    supplierId: "sup-1",
    supplierName: "Refaccionaria Central",
    isActive: true,
    createdAt: "10/10/2026",
  },
  {
    id: "art-2",
    name: "Aceite sintético 5W-30",
    sku: "ACE-001",
    brand: "Mobil",
    type: "PARTE_EN_VENTA",
    location: "A-02",
    minStock: 10,
    stock: 24,
    purchasePrice: 160,
    salePrice: 280,
    supplierId: "sup-3",
    supplierName: "Distribuidora Monterrey",
    isActive: true,
    createdAt: "10/10/2026",
  },
  {
    id: "art-3",
    name: "Limpiador de frenos",
    sku: "CON-002",
    brand: "CRC",
    type: "CONSUMIBLE",
    location: "B-01",
    minStock: 4,
    stock: 2,
    purchasePrice: 65,
    salePrice: 0,
    supplierId: "sup-2",
    supplierName: "AutoPartes del Norte",
    isActive: true,
    createdAt: "11/10/2026",
  },
];

let articlesStore: InventoryArticle[] = [...initialArticles];
let movementsStore: StockMovementItem[] = [];

export function getMockArticles(
  onlyLowStock: boolean = false,
  search: string = "",
): InventoryArticle[] {
  let list = articlesStore.filter((a) => a.isActive);

  if (onlyLowStock) {
    list = list.filter((a) => a.stock <= a.minStock);
  }

  const query = search.trim().toLowerCase();
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
}

export function addMockArticle(input: CreateArticleInput): InventoryArticle {
  const newItem: InventoryArticle = {
    id: `art-${Date.now()}`,
    name: input.name.trim(),
    sku: input.sku ? input.sku.trim().toUpperCase() : `REF-${Date.now().toString().slice(-4)}`,
    brand: input.brand ? input.brand.trim() : undefined,
    type: input.type,
    location: input.location ? input.location.trim().toUpperCase() : undefined,
    minStock: input.minStock,
    stock: input.minStock,
    purchasePrice: input.purchasePrice,
    salePrice: input.salePrice,
    supplierId: input.supplierId,
    supplierName: input.supplierName,
    isActive: true,
    createdAt: new Date().toLocaleDateString("es-MX"),
  };

  articlesStore = [newItem, ...articlesStore];
  return newItem;
}

export function updateMockArticle(
  id: string,
  input: CreateArticleInput,
): InventoryArticle | null {
  const idx = articlesStore.findIndex((a) => a.id === id);
  if (idx === -1) return null;

  const existing = articlesStore[idx];
  const updated: InventoryArticle = {
    ...existing,
    name: input.name.trim(),
    sku: input.sku ? input.sku.trim().toUpperCase() : existing.sku,
    brand: input.brand ? input.brand.trim() : undefined,
    type: input.type,
    location: input.location ? input.location.trim().toUpperCase() : undefined,
    minStock: input.minStock,
    purchasePrice: input.purchasePrice,
    salePrice: input.salePrice,
    supplierId: input.supplierId,
    supplierName: input.supplierName,
  };

  articlesStore[idx] = updated;
  return updated;
}

export function deactivateMockArticle(id: string): boolean {
  const target = articlesStore.find((a) => a.id === id);
  if (!target) return false;
  target.isActive = false;
  return true;
}

export function getMockMovements(articleId: string): StockMovementItem[] {
  return movementsStore.filter((m) => m.articleId === articleId);
}

export function registerMockMovement(
  articleId: string,
  type: StockMovementType,
  qty: number,
  reason?: string,
): { movement: StockMovementItem; article: InventoryArticle } | null {
  const article = articlesStore.find((a) => a.id === articleId);
  if (!article) return null;

  const before = article.stock;
  let after = before;

  if (type === "ENTRY") {
    after = before + qty;
  } else if (type === "EXIT") {
    after = Math.max(0, before - qty);
  } else if (type === "ADJUSTMENT") {
    after = qty;
  }

  article.stock = after;

  const movement: StockMovementItem = {
    id: `mov-${Date.now()}`,
    articleId,
    type,
    qty,
    before,
    after,
    reason: reason?.trim() || undefined,
    createdAt: new Date().toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  movementsStore = [movement, ...movementsStore];
  return { movement, article: { ...article } };
}
