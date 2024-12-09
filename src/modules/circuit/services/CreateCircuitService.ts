import { CircuitEntity, Frequency, ServiceType } from "../entities/Circuit";
import { ICircuitsRepository } from "../repositories/ICircuitsRepository";

type CreateCircuitServiceParams = {
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
};
export class CreateCircuitService {
  constructor(private circuitRepository: ICircuitsRepository) {}
  async execute(data: CreateCircuitServiceParams): Promise<CircuitEntity> {
    const circuit = await this.circuitRepository.createCircuit({
      code: data.code,
      addresses: JSON.stringify(data.addresses),
      sectors: data.sectors,
      frequency: JSON.stringify(data.frequency),
      startTime: data.startTime,
      endTime: data.endTime,
      serviceType: data.serviceType,
      equipment: data.equipment,
      destination: data.destination,
      city: data.city,
      state: data.state,
    });

    return circuit;
  }
}
