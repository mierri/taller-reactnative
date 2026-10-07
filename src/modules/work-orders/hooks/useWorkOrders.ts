import { useCallback, useEffect, useMemo, useState } from 'react';
import { MOCK_WORK_ORDERS } from '../mocks/work-orders.mock';
import { fetchWorkOrders } from '../services/work-orders.service';
import {
  WorkOrderCategory,
  WorkOrderDto,
  WorkOrdersSummaryStats,
} from '../types/work-order.types';
import { mapWorkOrderToCard } from '../utils/work-order-mapper';

export interface UseWorkOrdersOptions {
  selectedCategory?: WorkOrderCategory;
  searchQuery?: string;
  autoLoad?: boolean;
}

export function useWorkOrders(options: UseWorkOrdersOptions = {}) {
  const {
    selectedCategory = 'taller',
    searchQuery = '',
    autoLoad = false,
  } = options;

  const [rawOrders, setRawOrders] = useState<WorkOrderDto[]>([]);
  const [loading, setLoading] = useState(autoLoad);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchWorkOrders();
      setRawOrders(response.data);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Error al cargar las órdenes';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!autoLoad) return;
    let isMounted = true;

    async function load() {
      try {
        const response = await fetchWorkOrders();
        if (isMounted) {
          setRawOrders(response.data);
          setLoading(false);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const msg =
            err instanceof Error ? err.message : 'Error al cargar las órdenes';
          setError(msg);
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [autoLoad]);

  const cardOrders = useMemo(() => {
    return rawOrders.map(mapWorkOrderToCard);
  }, [rawOrders]);

  const stats = useMemo<WorkOrdersSummaryStats>(() => {
    let countTaller = 0;
    let countCotizando = 0;
    let countListas = 0;

    for (const order of cardOrders) {
      if (order.category === 'taller') countTaller++;
      else if (order.category === 'cotizando') countCotizando++;
      else if (order.category === 'listas') countListas++;
    }

    return { countTaller, countCotizando, countListas };
  }, [cardOrders]);

  const filteredOrders = useMemo(() => {
    return cardOrders.filter((order) => {
      const matchesCategory = order.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      return (
        order.folio.toLowerCase().includes(q) ||
        order.vehicle.toLowerCase().includes(q) ||
        order.plate.toLowerCase().includes(q) ||
        order.client.toLowerCase().includes(q)
      );
    });
  }, [cardOrders, selectedCategory, searchQuery]);

  const loadSampleOrder = useCallback(() => {
    setRawOrders(MOCK_WORK_ORDERS);
  }, []);

  const clearOrders = useCallback(() => {
    setRawOrders([]);
  }, []);

  return {
    orders: cardOrders,
    filteredOrders,
    stats,
    loading,
    error,
    refresh,
    loadSampleOrder,
    clearOrders,
    totalCount: rawOrders.length,
  };
}

