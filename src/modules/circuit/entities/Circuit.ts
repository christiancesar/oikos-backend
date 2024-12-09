import { randomUUID } from "crypto";
export enum Frequency {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
}

export enum ServiceType {
  CONVENTIONAL = "CONVENTIONAL",
  SELECTIVE = "SELECTIVE",
}

type CircuitConstructorProps = {
  id?: string;
  code: string;
  addresses: string[];
  city: string;
  state: string;
  sectors?: string | null;
  frequency: Frequency[];
  startTime?: string | null;
  endTime?: string | null;
  serviceType: ServiceType;
  equipment?: string | null;
  destination?: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
};

export class CircuitEntity {
  id: string; // Unique Identifier
  code: string; // Circuit Code (e.g., "102502")
  addresses: string[]; // Array of addresses (e.g., ["SQS 302", "SQS 303"])
  city: string;
  state: string;
  sectors?: string | null; // Array of sectors (e.g., ["North", "South"])
  frequency: Frequency[]; // Days of operation (e.g., ["Monday", "Wednesday", "Friday"])
  startTime?: string | null; // Start time of the collection (e.g., "07:00:00")
  endTime?: string | null; // End time of the collection (e.g., "15:20:00")
  serviceType: ServiceType; // Type of service (e.g., "Conventional Collection")
  equipment?: string | null; // Equipment used (e.g., "19m³ Compactor Truck")
  destination?: string | null; // Final destination of the waste (e.g., "UTMB Asa Sul")
  createdAt: Date;
  updatedAt?: Date | null;

  constructor({
    id,
    startTime,
    endTime,
    serviceType,
    sectors,
    frequency,
    equipment,
    destination,
    code,
    addresses,
    city,
    state,
    createdAt,
    updatedAt,
  }: CircuitConstructorProps) {
    this.id = id ?? randomUUID();
    this.code = code;
    this.addresses = addresses;
    this.city = city;
    this.state = state;
    this.sectors = sectors;
    this.frequency = frequency;
    this.startTime = startTime;
    this.endTime = endTime;
    this.serviceType = serviceType;
    this.equipment = equipment;
    this.destination = destination;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
