export type ArticleType = "PARTE_EN_VENTA" | "CONSUMIBLE";

export type InventoryTabKey = "parts" | "tools" | "custody";

export type StockMovementType = "ENTRY" | "EXIT" | "ADJUSTMENT";

export interface StockMovementItem {
  id: string;
  articleId: string;
  type: StockMovementType;
  qty: number;
  before: number;
  after: number;
  reason?: string;
  createdAt: string;
}

export interface InventoryArticle {
  id: string;
  sku: string;
  name: string;
  brand?: string;
  type: ArticleType;
  location?: string;
  minStock: number;
  stock: number;
  purchasePrice: number;
  salePrice: number;
  supplierId?: string;
  supplierName?: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateArticleInput {
  name: string;
  sku?: string;
  brand?: string;
  type: ArticleType;
  supplierId?: string;
  supplierName?: string;
  location?: string;
  minStock: number;
  purchasePrice: number;
  salePrice: number;
}
