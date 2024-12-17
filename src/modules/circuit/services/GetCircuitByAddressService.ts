import { AppError } from "@common/errors/AppError";
import { CircuitEntity } from "../entities/Circuit";
import { ICircuitsRepository } from "../repositories/ICircuitsRepository";

type CircuitSearch = {
  address: string;
  city: string;
  state: string;
};

export class GetCircuitByAddressService {
  constructor(private repository: ICircuitsRepository) {}
  async execute(data: CircuitSearch): Promise<CircuitEntity> {
    if (!data.address || !data.city || !data.state) {
      throw new AppError(
        "Address, city and state are required and cannot be empty",
      );
    }
    const circuitExist = await this.repository.searchCircuitByAddress(data);

    if (!circuitExist) {
      throw new AppError("Circuit not found");
    }

    return circuitExist;
  }
}
