import { CircuitEntity } from "../entities/Circuit";
import { ICircuitsRepository } from "../repositories/ICircuitsRepository";

export class ListCircuitsService {
  constructor(private circuitRepository: ICircuitsRepository) {}
  async execute(): Promise<CircuitEntity[]> {
    const circuits = await this.circuitRepository.findManyCircuits();
    return circuits;
  }
}
