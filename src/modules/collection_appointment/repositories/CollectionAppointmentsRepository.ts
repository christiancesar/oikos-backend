import { prisma } from "prisma";
import {
  CollectionAppointmentEntity,
  StatusCollectionAppointment,
} from "../entities/CollectionAppointment";
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

  async listCollectionAppointmentByCustomerId({
    customerId,
  }: {
    customerId: string;
  }): Promise<CollectionAppointmentEntity[]> {
    const appointment = await prisma.collectionAppointment.findMany({
      where: {
        customerId,
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

    return appointment.map(CollectionAppointmentMapper.toEntity);
  }

  async findCollectionAppointmentById({
    appointmentId,
  }: {
    appointmentId: string;
  }): Promise<CollectionAppointmentEntity | undefined> {
    const appointment = await prisma.collectionAppointment.findUnique({
      where: {
        id: appointmentId,
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

    if (!appointment) return;

    return CollectionAppointmentMapper.toEntity(appointment);
  }

  async cancelCollectionAppointment({
    customerId,
    appointmentId,
    reason,
  }: {
    customerId: string;
    appointmentId: string;
    reason: string;
  }): Promise<CollectionAppointmentEntity> {
    const appointment = await prisma.collectionAppointment.update({
      where: {
        id: appointmentId,
        customerId,
      },
      data: {
        status: StatusCollectionAppointment.CANCELED,
        reasonForCancellation: reason,
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

  async updateScheduleForAppointment(data: {
    customerId: string;
    appointmentId: string;
    scheduleFor: Date;
  }): Promise<CollectionAppointmentEntity> {
    const appointment = await prisma.collectionAppointment.update({
      where: {
        id: data.appointmentId,
        customerId: data.customerId,
      },
      data: {
        scheduleFor: data.scheduleFor,
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
