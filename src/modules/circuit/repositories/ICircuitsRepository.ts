import { CircuitEntity } from "../entities/Circuit";

export type CreateCircuitDTO = {
  code: string;
  addresses: string;
  sectors?: string | null;
  frequency: string;
  startTime?: string | null;
  endTime?: string | null;
  serviceType: string;
  equipment?: string | null;
  destination?: string | null;
  city: string;
  state: string;
};

export type CircuitSearchDTO = {
  address: string;
  city: string;
  state: string;
};

export interface ICircuitsRepository {
  createCircuit(data: CreateCircuitDTO): Promise<CircuitEntity>;
  findManyCircuits(): Promise<CircuitEntity[]>;
  searchCircuitByAddress(
    address: CircuitSearchDTO,
  ): Promise<CircuitEntity | null>;
}
