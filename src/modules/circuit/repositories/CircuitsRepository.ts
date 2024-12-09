import { randomUUID } from "crypto";
import { prisma } from "prisma";
import { CircuitEntity } from "../entities/Circuit";
import {
  CircuitSearchDTO,
  CreateCircuitDTO,
  ICircuitsRepository,
} from "./ICircuitsRepository";
import { CircuitMapper } from "./mappers/CircuitMapper";

export class CircuitsRepository implements ICircuitsRepository {
  async createCircuit(data: CreateCircuitDTO): Promise<CircuitEntity> {
    const id = randomUUID();
    const circuit = await prisma.circuit.create({
      data: {
        id,
        code: data.code ?? id.slice(0, 8).toLocaleUpperCase(),
        addresses: data.addresses,
        sectors: data.sectors,
        frequency: data.frequency,
        startTime: data.startTime,
        endTime: data.endTime,
        serviceType: data.serviceType,
        equipment: data.equipment,
        destination: data.destination,
        city: data.city,
        state: data.state,
      },
    });

    return CircuitMapper.toEntity(circuit);
  }

  async findManyCircuits(): Promise<CircuitEntity[]> {
    const circuits = await prisma.circuit.findMany();
    return circuits.map(CircuitMapper.toEntity);
  }

  async searchCircuitByAddress(
    address: CircuitSearchDTO,
  ): Promise<CircuitEntity | null> {
    const circuit = await prisma.circuit.findFirst({
      where: {
        addresses: {
          contains: address.address,
        },
        city: address.city,
        state: address.state,
      },
    });

    return circuit ? CircuitMapper.toEntity(circuit) : null;
  }
}
