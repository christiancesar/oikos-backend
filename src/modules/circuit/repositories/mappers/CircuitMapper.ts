import { CircuitEntity, ServiceType } from "@modules/circuit/entities/Circuit";
import { Prisma } from "@prisma/client";

type CircuitPrisma = Prisma.CircuitGetPayload<{
  select: {
    id: true;
    code: true;
    addresses: true;
    sectors: true;
    frequency: true;
    startTime: true;
    endTime: true;
    serviceType: true;
    equipment: true;
    destination: true;
    city: true;
    state: true;
    createdAt: true;
    updatedAt: true;
  };
}>;

export class CircuitMapper {
  static toEntity(data: CircuitPrisma): CircuitEntity {
    return new CircuitEntity({
      id: data.id,
      code: data.code,
      addresses: JSON.parse(data.addresses),
      sectors: data.sectors,
      frequency: JSON.parse(data.frequency),
      startTime: data.startTime,
      endTime: data.endTime,
      serviceType: ServiceType[data.serviceType as keyof typeof ServiceType],
      equipment: data.equipment,
      destination: data.destination,
      city: data.city,
      state: data.state,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}
