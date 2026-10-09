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
    mileageIn: 70000,
    fuelLevel: 50,
    failureDescription: 'jijija',
    estimatedDelivery: '2026-10-14T14:29:00.000Z',
    createdAt: '2026-10-07T10:00:00.000Z',
    updatedAt: '2026-10-07T10:00:00.000Z',
  },
  {
    id: 'wo-suzuki',
    workshopId: 'ws-1',
    code: 'OT-1042',
    clientId: 'cli-4',
    clientName: 'Fernando Ruiz',
    vehicleId: 'veh-4',
    vehicleDescription: 'Suzuki Swift (KZM-809-A)',
    serviceAdvisorId: 'adv-2',
    serviceAdvisorName: 'Carlos',
    operationalStatus: OperationalStatus.EN_DIAGNOSTICO,
    commercialStatus: CommercialStatus.SIN_COTIZAR,
    billingStatus: BillingStatus.PENDIENTE,
    estaRetrasada: false,
    portalToken: 'portal-token-suzuki',
    mileageIn: 39245,
    fuelLevel: 50,
    failureDescription: 'Servicio de 30,000 km',
    diagnosis: 'aaaaaaaaaaaaaaaaaaaa',
    estimatedDelivery: '2026-10-14T14:29:00.000Z',
    createdAt: '2026-10-07T09:00:00.000Z',
    updatedAt: '2026-10-07T09:00:00.000Z',
  },
  {
    id: 'wo-2',
    workshopId: 'ws-1',
    code: 'OT-1048',
    clientId: 'cli-2',
    clientName: 'Roberto Gómez',
    vehicleId: 'veh-2',
    vehicleDescription: 'Chevrolet Aveo (JNX-923-C)',
    serviceAdvisorId: 'adv-2',
    serviceAdvisorName: 'Carlos',
    operationalStatus: OperationalStatus.EN_ESPERA_COTIZACION,
    commercialStatus: CommercialStatus.SIN_COTIZAR,
    billingStatus: BillingStatus.PENDIENTE,
    estaRetrasada: false,
    portalToken: 'portal-token-2',
    failureDescription: 'Ruido metálico en frenos delanteros y afinación mayor',
    estimatedDelivery: '2026-10-15T11:00:00.000Z',
    createdAt: '2026-10-07T11:30:00.000Z',
    updatedAt: '2026-10-07T11:30:00.000Z',
  },
  {
    id: 'wo-3',
    workshopId: 'ws-1',
    code: 'OT-1045',
    clientId: 'cli-3',
    clientName: 'Sofía Ruiz',
    vehicleId: 'veh-3',
    vehicleDescription: 'Mazda 3 (DF-849-ZZ)',
    serviceAdvisorId: 'adv-1',
    serviceAdvisorName: 'Mariana',
    operationalStatus: OperationalStatus.LISTA_PARA_ENTREGA,
    commercialStatus: CommercialStatus.APROBADA_TOTAL,
    billingStatus: BillingStatus.FACTURADA,
    estaRetrasada: false,
    portalToken: 'portal-token-3',
    failureDescription: 'Mantenimiento preventivo 40,000 km y lavado de motor',
    estimatedDelivery: '2026-10-13T18:00:00.000Z',
    createdAt: '2026-10-06T09:00:00.000Z',
    updatedAt: '2026-10-07T16:00:00.000Z',
  },
  {
    id: 'wo-4',
    workshopId: 'ws-1',
    code: 'OT-1042',
    clientId: 'cli-4',
    clientName: 'Alejandro Peña',
    vehicleId: 'veh-4',
    vehicleDescription: 'Toyota Corolla (GTO-332-A)',
    serviceAdvisorId: 'adv-3',
    serviceAdvisorName: 'Roberto',
    operationalStatus: OperationalStatus.EN_REPARACION,
    commercialStatus: CommercialStatus.APROBADA_PARCIAL,
    billingStatus: BillingStatus.PENDIENTE,
    estaRetrasada: true,
    portalToken: 'portal-token-4',
    failureDescription: 'Falla en caja de transmisión y suspensión delantera',
    estimatedDelivery: '2026-10-06T12:00:00.000Z',
    createdAt: '2026-10-05T08:30:00.000Z',
    updatedAt: '2026-10-07T15:20:00.000Z',
  },
  {
    id: 'wo-5',
    workshopId: 'ws-1',
    code: 'OT-1039',
    clientId: 'cli-5',
    clientName: 'Luis Torres',
    vehicleId: 'veh-5',
    vehicleDescription: 'Volkswagen Jetta (ABC-1234)',
    serviceAdvisorId: 'adv-2',
    serviceAdvisorName: 'Carlos',
    operationalStatus: OperationalStatus.ENTREGADA,
    commercialStatus: CommercialStatus.APROBADA_TOTAL,
    billingStatus: BillingStatus.FACTURADA,
    estaRetrasada: false,
    portalToken: 'portal-token-5',
    failureDescription: 'Cambio de amortiguadores y balanceo de llantas',
    estimatedDelivery: '2026-10-04T17:00:00.000Z',
    deliveredAt: '2026-10-04T17:30:00.000Z',
    closedAt: '2026-10-04T17:30:00.000Z',
    createdAt: '2026-10-03T10:00:00.000Z',
    updatedAt: '2026-10-04T17:30:00.000Z',
  },
];

let dynamicOrders = [...MOCK_WORK_ORDERS];

export function getMockWorkOrders(query?: ListWorkOrdersQuery): {
  data: WorkOrderDto[];
  total: number;
} {
  let filtered = [...dynamicOrders];

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

export function addMockWorkOrder(order: Partial<WorkOrderDto>): WorkOrderDto {
  const nextNumber = 1050 + dynamicOrders.length;
  const newOrder: WorkOrderDto = {
    id: `wo-${Date.now()}`,
    workshopId: "ws-1",
    code: `OT-${nextNumber}`,
    clientId: order.clientId || `cli-${Date.now()}`,
    clientName: order.clientName || "Cliente",
    vehicleId: order.vehicleId || `veh-${Date.now()}`,
    vehicleDescription:
      order.vehicleDescription || "Vehículo sin descripción",
    serviceAdvisorId: order.serviceAdvisorId || "adv-1",
    serviceAdvisorName: order.serviceAdvisorName || "Daniel",
    operationalStatus: OperationalStatus.RECIBIDA,
    commercialStatus: CommercialStatus.SIN_COTIZAR,
    billingStatus: BillingStatus.PENDIENTE,
    estaRetrasada: false,
    portalToken: `token-${Date.now()}`,
    failureDescription: order.failureDescription || "Recepción general",
    estimatedDelivery:
      order.estimatedDelivery || new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  dynamicOrders = [newOrder, ...dynamicOrders];
  return newOrder;
}

