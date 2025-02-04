import {
  CircuitEntity,
  Frequency,
  ServiceType,
} from "@modules/circuit/entities/Circuit";
import {
  CircuitSearchDTO,
  CreateCircuitDTO,
  ICircuitsRepository,
} from "../ICircuitsRepository";
import { randomUUID } from "node:crypto";

export class CircuitsRepositoryInMemory implements ICircuitsRepository {
  private circuits: CircuitEntity[] = [];

  async createCircuit(data: CreateCircuitDTO): Promise<CircuitEntity> {
    const id = randomUUID();
    const circuit = new CircuitEntity({
      id,
      code: data.code ?? id.slice(0, 8).toLocaleUpperCase(),
      addresses: JSON.parse(data.addresses) as string[],
      city: data.city,
      state: data.state,
      sectors: data.sectors,
      frequency: JSON.parse(data.frequency) as Frequency[],
      startTime: data.startTime,
      endTime: data.endTime,
      serviceType: data.serviceType as ServiceType,
      equipment: data.equipment,
      destination: data.destination,
    });

    this.circuits.push(circuit);

    return circuit;
  }

  async findManyCircuits(): Promise<CircuitEntity[]> {
    return this.circuits;
  }

  async searchCircuitByAddress({
    address,
    city,
    state,
  }: CircuitSearchDTO): Promise<CircuitEntity | null> {
    const circuit = this.circuits.find(
      (circuit) =>
        circuit.city.toLocaleLowerCase() === city.toLocaleLowerCase() &&
        circuit.state.toLocaleLowerCase() === state.toLocaleLowerCase() &&
        circuit.addresses.some(
          (addr) => addr.toLocaleLowerCase() === address.toLocaleLowerCase(),
        ),
    );

    return circuit || null;
  }
}
