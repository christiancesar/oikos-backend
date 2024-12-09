import { CircuitEntity } from "../entities/Circuit";
import { ICircuitsRepository } from "../repositories/ICircuitsRepository";

type CircuitSearch = {
  address: string;
  city: string;
  state: string;
};

export class GetCircuitByAddressService {
  constructor(private repository: ICircuitsRepository) {}
  async execute(data: CircuitSearch): Promise<CircuitEntity | string> {
    const circuitExist = await this.repository.searchCircuitByAddress(data);

    if (!circuitExist) {
      return "Address not found on collection route.";
    }

    return circuitExist;
  }
}
