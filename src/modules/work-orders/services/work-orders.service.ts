import { CONFIG } from '@/config/env';
import { apiRequest } from '@/services/api';
import { getMockWorkOrders } from '../mocks/work-orders.mock';
import {
  ListWorkOrdersQuery,
  WorkOrderDto,
} from '../types/work-order.types';

function buildQueryString(query?: ListWorkOrdersQuery): string {
  if (!query) return '';
  const params = new URLSearchParams();

  if (query.page !== undefined) params.append('page', query.page.toString());
  if (query.limit !== undefined) params.append('limit', query.limit.toString());
  if (query.operationalStatus) params.append('operationalStatus', query.operationalStatus);
  if (query.commercialStatus) params.append('commercialStatus', query.commercialStatus);
  if (query.serviceAdvisorId) params.append('serviceAdvisorId', query.serviceAdvisorId);
  if (query.clientId) params.append('clientId', query.clientId);
  if (query.vehicleId) params.append('vehicleId', query.vehicleId);
  if (query.estaRetrasada !== undefined) params.append('estaRetrasada', query.estaRetrasada.toString());
  if (query.search?.trim()) params.append('search', query.search.trim());

  const str = params.toString();
  return str ? `?${str}` : '';
}

export async function fetchWorkOrders(
  query?: ListWorkOrdersQuery,
): Promise<{ data: WorkOrderDto[]; total: number }> {
  if (CONFIG.useMocks) {
    return Promise.resolve(getMockWorkOrders(query));
  }

  const qs = buildQueryString(query);
  return apiRequest<{ data: WorkOrderDto[]; total: number }>(`/work-orders${qs}`, {
    method: 'GET',
  });
}

export async function fetchWorkOrderById(id: string): Promise<WorkOrderDto> {
  if (CONFIG.useMocks) {
    const orders = getMockWorkOrders().data;
    const mock = orders.find((item) => item.id === id || item.code === id);
    if (mock) return Promise.resolve(mock);
    if (orders.length > 0) return Promise.resolve(orders[0]);
    throw new Error(`Orden ${id} no encontrada`);
  }

  return apiRequest<WorkOrderDto>(`/work-orders/${id}`, {
    method: 'GET',
  });
}

