export type VehicleType = "Auto" | "Camioneta" | "Carga";

export interface MockVehicle {
  id: string;
  clientId?: string;
  brand: string;
  model: string;
  year: string;
  vehicleType: VehicleType;
  plate: string;
  vin?: string;
  mileage?: string;
}

export const MOCK_VEHICLES: MockVehicle[] = [
  {
    id: "veh-1",
    clientId: "cli-1",
    brand: "Volkswagen",
    model: "Jetta",
    year: "2021",
    vehicleType: "Auto",
    plate: "PXM-482-B",
    vin: "3VW2K7AJ8NM123456",
    mileage: "48,500 km",
  },
  {
    id: "veh-2",
    clientId: "cli-2",
    brand: "Mazda",
    model: "CX-5",
    year: "2023",
    vehicleType: "Camioneta",
    plate: "NYL-231-A",
    vin: "JM3KFBDM8P0654321",
    mileage: "24,100 km",
  },
  {
    id: "veh-3",
    clientId: "cli-3",
    brand: "Kia",
    model: "Sportage",
    year: "2022",
    vehicleType: "Camioneta",
    plate: "MRK-672-A",
    vin: "KNDPMCAC5N7789012",
    mileage: "36,800 km",
  },
  {
    id: "veh-4",
    clientId: "cli-4",
    brand: "Ford",
    model: "Transit Custom",
    year: "2020",
    vehicleType: "Carga",
    plate: "LZ-9812-C",
    vin: "WF0YXXTTGYLK99887",
    mileage: "112,000 km",
  },
  {
    id: "veh-5",
    clientId: "cli-5",
    brand: "Chevrolet",
    model: "Aveo",
    year: "2019",
    vehicleType: "Auto",
    plate: "JNX-923-C",
    vin: "3G1BE6SM4KS334455",
    mileage: "85,400 km",
  },
];

let dynamicVehicles = [...MOCK_VEHICLES];

export function getMockVehicles(clientId?: string): MockVehicle[] {
  if (clientId) {
    return dynamicVehicles.filter((v) => v.clientId === clientId);
  }
  return [...dynamicVehicles];
}

export function searchMockVehicles(
  query: string,
  clientId?: string
): MockVehicle[] {
  const q = query.trim().toLowerCase();
  let base = dynamicVehicles;
  if (clientId) {
    base = base.filter((v) => v.clientId === clientId);
  }
  if (!q) return base;
  return base.filter(
    (v) =>
      v.plate.toLowerCase().includes(q) ||
      v.brand.toLowerCase().includes(q) ||
      v.model.toLowerCase().includes(q) ||
      (v.vin && v.vin.toLowerCase().includes(q))
  );
}

export function addMockVehicle(
  data: Omit<MockVehicle, "id">
): MockVehicle {
  const newVehicle: MockVehicle = {
    ...data,
    id: `veh-${Date.now()}`,
  };
  dynamicVehicles = [newVehicle, ...dynamicVehicles];
  return newVehicle;
}

export function getMockVehicleById(id: string): MockVehicle | undefined {
  return dynamicVehicles.find((v) => v.id === id);
}

