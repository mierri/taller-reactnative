import { useCallback, useEffect, useMemo, useState } from 'react';
import { MOCK_WORK_ORDERS } from '../mocks/work-orders.mock';
import { fetchWorkOrders } from '../services/work-orders.service';
import {
  OperationalStatus,
  WorkOrderCategory,
  WorkOrderDto,
  WorkOrdersSummaryStats,
} from '../types/work-order.types';
import { mapWorkOrderToCard } from '../utils/work-order-mapper';

export interface WorkOrderFilters {
  advisor?: string;
  operationalStatus?: OperationalStatus | 'all';
  onlyDelayed?: boolean;
  includeClosed?: boolean;
}

export interface UseWorkOrdersOptions {
  selectedCategory?: WorkOrderCategory;
  searchQuery?: string;
  filters?: WorkOrderFilters;
  autoLoad?: boolean;
}

export function useWorkOrders(options: UseWorkOrdersOptions = {}) {
  const {
    selectedCategory = 'taller',
    searchQuery = '',
    filters = {},
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

  const availableAdvisors = useMemo(() => {
    const set = new Set<string>();
    for (const order of rawOrders) {
      if (order.serviceAdvisorName) {
        set.add(order.serviceAdvisorName);
      }
    }
    return Array.from(set);
  }, [rawOrders]);

  const stats = useMemo<WorkOrdersSummaryStats>(() => {
    let countTaller = 0;
    let countCotizando = 0;
    let countListas = 0;

    for (const order of cardOrders) {
      const isClosed =
        order.original.operationalStatus === OperationalStatus.ENTREGADA ||
        order.original.operationalStatus === OperationalStatus.CERRADA ||
        order.original.operationalStatus === OperationalStatus.CANCELADA;

      if (!isClosed) {
        countTaller++;
      }
      if (order.category === 'cotizando') {
        countCotizando++;
      }
      if (order.category === 'listas') {
        countListas++;
      }
    }

    return { countTaller, countCotizando, countListas };
  }, [cardOrders]);

  const hasActiveFilters = useMemo(() => {
    const hasSearch = searchQuery.trim().length > 0;
    const hasAdvisor = Boolean(filters.advisor && filters.advisor !== 'all');
    const hasStatus = Boolean(
      filters.operationalStatus && filters.operationalStatus !== 'all',
    );
    const hasDelayed = Boolean(filters.onlyDelayed);
    const hasClosed = Boolean(filters.includeClosed);

    return hasSearch || hasAdvisor || hasStatus || hasDelayed || hasClosed;
  }, [searchQuery, filters]);

  const filteredOrders = useMemo(() => {
    return cardOrders.filter((order) => {
      const isClosed =
        order.original.operationalStatus === OperationalStatus.ENTREGADA ||
        order.original.operationalStatus === OperationalStatus.CERRADA ||
        order.original.operationalStatus === OperationalStatus.CANCELADA;

      if (selectedCategory === 'taller') {
        if (isClosed && !filters.includeClosed) {
          return false;
        }
      } else if (selectedCategory === 'cotizando') {
        if (order.category !== 'cotizando') {
          return false;
        }
      } else if (selectedCategory === 'listas') {
        if (order.category !== 'listas') {
          return false;
        }
      }

      if (filters.advisor && filters.advisor !== 'all') {
        if (order.advisor !== filters.advisor) {
          return false;
        }
      }

      if (filters.operationalStatus && filters.operationalStatus !== 'all') {
        if (order.original.operationalStatus !== filters.operationalStatus) {
          return false;
        }
      }

      if (filters.onlyDelayed) {
        if (!order.isLate) {
          return false;
        }
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          order.folio.toLowerCase().includes(q) ||
          order.vehicle.toLowerCase().includes(q) ||
          order.plate.toLowerCase().includes(q) ||
          order.client.toLowerCase().includes(q);

        if (!matchesQuery) {
          return false;
        }
      }

      return true;
    });
  }, [cardOrders, selectedCategory, searchQuery, filters]);

  const loadSampleOrder = useCallback(() => {
    setRawOrders(MOCK_WORK_ORDERS);
  }, []);

  const clearOrders = useCallback(() => {
    setRawOrders([]);
  }, []);

  return {
    orders: cardOrders,
    filteredOrders,
    availableAdvisors,
    stats,
    hasActiveFilters,
    loading,
    error,
    refresh,
    loadSampleOrder,
    clearOrders,
    totalCount: rawOrders.length,
  };
}
