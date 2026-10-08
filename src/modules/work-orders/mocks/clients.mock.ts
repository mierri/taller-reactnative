export interface MockClient {
  id: string;
  name: string;
  clientType: "Persona física" | "Persona moral";
  phone: string;
  email?: string;
  address?: string;
  primaryVehicle?: string;
  plate?: string;
}

export const MOCK_CLIENTS: MockClient[] = [
  {
    id: "cli-1",
    name: "Carlos Mendoza",
    clientType: "Persona física",
    phone: "55 1234 5678",
    email: "carlos.mendoza@email.com",
    address: "Av. Insurgentes Sur 1200, Benito Juárez, CDMX",
    primaryVehicle: "Volkswagen Jetta",
    plate: "PXM-482-B",
  },
  {
    id: "cli-2",
    name: "Ana García",
    clientType: "Persona física",
    phone: "55 8765 4321",
    email: "ana.garcia@email.com",
    address: "Col. Del Valle Norte, CDMX",
    primaryVehicle: "Mazda CX-5",
    plate: "NYL-231-A",
  },
  {
    id: "cli-3",
    name: "Sofía Ramírez",
    clientType: "Persona física",
    phone: "55 4567 8901",
    email: "sofia.ramirez@email.com",
    address: "Polanco V Sección, Miguel Hidalgo, CDMX",
    primaryVehicle: "Kia Sportage",
    plate: "MRK-672-A",
  },
  {
    id: "cli-4",
    name: "Transportes y Logística del Norte S.A. de C.V.",
    clientType: "Persona moral",
    phone: "55 9988 7766",
    email: "contacto@transnorte.com",
    address: "Parque Industrial Vallejo, Azcapotzalco, CDMX",
    primaryVehicle: "Ford Transit Custom",
    plate: "LZ-9812-C",
  },
  {
    id: "cli-5",
    name: "Roberto Gómez",
    clientType: "Persona física",
    phone: "55 3344 5566",
    email: "roberto.gomez@email.com",
    address: "Coyoacán, CDMX",
    primaryVehicle: "Chevrolet Aveo",
    plate: "JNX-923-C",
  },
];

let dynamicClients = [...MOCK_CLIENTS];

export function getMockClients(): MockClient[] {
  return [...dynamicClients];
}

export function searchMockClients(query: string): MockClient[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return dynamicClients.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      (c.plate && c.plate.toLowerCase().includes(q)) ||
      (c.primaryVehicle && c.primaryVehicle.toLowerCase().includes(q))
  );
}

export function addMockClient(
  data: Omit<MockClient, "id">
): MockClient {
  const newClient: MockClient = {
    ...data,
    id: `cli-${Date.now()}`,
  };
  dynamicClients = [newClient, ...dynamicClients];
  return newClient;
}

export function getMockClientById(id: string): MockClient | undefined {
  return dynamicClients.find((c) => c.id === id);
}

