import { prisma } from "prisma";
import { CollectionAppointmentEntity } from "../entities/CollectionAppointment";
import {
  CreateCollectionAppointmentDTO,
  ICollectionAppointmentsRepository,
} from "./ICollectionAppointmentsRepository";
import { CollectionAppointmentMapper } from "./mappers/CollectionAppointmentMapper";

export class CollectionAppointmentsRepository
  implements ICollectionAppointmentsRepository
{
  async createCollectionAppointment(
    data: CreateCollectionAppointmentDTO,
  ): Promise<CollectionAppointmentEntity> {
    const appointment = await prisma.collectionAppointment.create({
      data: {
        companyId: data.companyId,
        customerId: data.customerId,
        scheduleFor: data.scheduleFor,
        wastes: {
          connect: data.wastes.map((wasteId) => ({ id: wasteId })),
        },
      },
      include: {
        company: true,
        customer: {
          include: {
            profile: {
              include: {
                address: true,
              },
            },
          },
        },
        wastes: true,
      },
    });

    return CollectionAppointmentMapper.toEntity(appointment);
  }
}
