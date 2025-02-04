import { AppError } from "@common/errors/AppError";
import { CircuitEntity, Frequency, ServiceType } from "../entities/Circuit";
import { ICircuitsRepository } from "../repositories/ICircuitsRepository";

type CreateCircuitServiceParams = {
  code?: string | null;
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
    if (data.frequency.length === 0) {
      throw new AppError("Frequency is required");
    }

    if (data.addresses.length === 0) {
      throw new AppError("Addresses is required");
    }

    data.addresses.forEach((address) => {
      if (address.trim() === "") {
        throw new AppError("Address not be empty");
      }
    });

    data.frequency.forEach((frequency) => {
      if (!Object.values(Frequency).includes(frequency)) {
        throw new AppError("Invalid frequency");
      }
    });

    if (!Object.values(ServiceType).includes(data.serviceType)) {
      throw new AppError("Invalid service type");
    }

    if (data.city.trim() === "" || data.state.trim() === "") {
      throw new AppError("City and State is required");
    }

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
