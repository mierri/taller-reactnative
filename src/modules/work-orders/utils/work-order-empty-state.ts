import { WorkOrderCategory } from "../types/work-order.types";

export interface EmptyStateOptions {
  totalCount: number;
  hasActiveFilters: boolean;
  selectedCategory: WorkOrderCategory;
  onResetFilters: () => void;
  onNewOrder: () => void;
  onLoadSample?: () => void;
}

export function getWorkOrdersEmptyState({
  totalCount,
  hasActiveFilters,
  selectedCategory,
  onResetFilters,
  onNewOrder,
}: EmptyStateOptions) {
  if (totalCount === 0) {
    return {
      title: "Tu primera orden empieza aquí",
      description:
        "Toca Nueva Orden para registrar al cliente, su vehículo y comenzar el diagnóstico.",
      actionLabel: "Nueva Orden",
      actionButtonType: "Secondary" as const,
      onActionPress: onNewOrder,
    };
  }

  if (hasActiveFilters) {
    return {
      title: "Sin resultados de búsqueda",
      description:
        "No encontramos órdenes que coincidan con los filtros o el texto ingresado.",
      actionLabel: "Restablecer filtros",
      actionButtonType: "Secondary" as const,
      onActionPress: onResetFilters,
    };
  }

  if (selectedCategory === "cotizando") {
    return {
      title: "No hay órdenes cotizando",
      description:
        "Las órdenes en diagnóstico que requieran cotización y aprobación aparecerán aquí.",
      actionLabel: "Nueva Orden",
      actionButtonType: "Secondary" as const,
      onActionPress: onNewOrder,
    };
  }

  if (selectedCategory === "listas") {
    return {
      title: "No hay órdenes listas",
      description:
        "Los vehículos que hayan concluido su reparación aparecerán aquí para entrega.",
      actionLabel: "Nueva Orden",
      actionButtonType: "Secondary" as const,
      onActionPress: onNewOrder,
    };
  }

  return {
    title: "No hay órdenes en taller",
    description: "No hay vehículos activos en el taller en este momento.",
    actionLabel: "Nueva Orden",
    actionButtonType: "Secondary" as const,
    onActionPress: onNewOrder,
  };
}
