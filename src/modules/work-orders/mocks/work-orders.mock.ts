import {
  BillingStatus,
  CommercialStatus,
  ListWorkOrdersQuery,
  OperationalStatus,
  WorkOrderDto,
} from '../types/work-order.types';

export const MOCK_WORK_ORDERS: WorkOrderDto[] = [
  {
    id: 'wo-1',
    workshopId: 'ws-1',
    code: 'OT-1049',
    clientId: 'cli-1',
    clientName: 'Mafer',
    vehicleId: 'veh-1',
    vehicleDescription: 'Nissan Versa (PXM-482-B)',
    serviceAdvisorId: 'adv-1',
    serviceAdvisorName: 'Mariana',
    operationalStatus: OperationalStatus.RECIBIDA,
    commercialStatus: CommercialStatus.SIN_COTIZAR,
    billingStatus: BillingStatus.PENDIENTE,
    estaRetrasada: false,
    portalToken: 'portal-token-1',
    failureDescription: 'Revisión general y cambio de aceite',
    estimatedDelivery: '2026-10-14T14:29:00.000Z',
    createdAt: '2026-10-07T10:00:00.000Z',
    updatedAt: '2026-10-07T10:00:00.000Z',
  },
];

export function getMockWorkOrders(query?: ListWorkOrdersQuery): {
  data: WorkOrderDto[];
  total: number;
} {
  let filtered = [...MOCK_WORK_ORDERS];

  if (query?.operationalStatus) {
    filtered = filtered.filter(
      (item) => item.operationalStatus === query.operationalStatus,
    );
  }

  if (query?.commercialStatus) {
    filtered = filtered.filter(
      (item) => item.commercialStatus === query.commercialStatus,
    );
  }

  if (query?.estaRetrasada !== undefined) {
    filtered = filtered.filter(
      (item) => item.estaRetrasada === query.estaRetrasada,
    );
  }

  if (query?.search?.trim()) {
    const q = query.search.toLowerCase().trim();
    filtered = filtered.filter((item) => {
      return (
        item.code.toLowerCase().includes(q) ||
        (item.clientName && item.clientName.toLowerCase().includes(q)) ||
        (item.vehicleDescription &&
          item.vehicleDescription.toLowerCase().includes(q))
      );
    });
  }

  return {
    data: filtered,
    total: filtered.length,
  };
}

