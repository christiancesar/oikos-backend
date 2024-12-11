import { Prisma } from "@prisma/client";
import {
  CollectionAppointmentEntity,
  StatusCollectionAppointment,
} from "../../entities/CollectionAppointment";

type CollectionAppointmentPrisma = Prisma.CollectionAppointmentGetPayload<{
  include: {
    company: true;
    customer: {
      include: {
        profile: {
          include: {
            address: true;
          };
        };
      };
    };
    wastes: true;
  };
}>;

export class CollectionAppointmentMapper {
  static toEntity(
    data: CollectionAppointmentPrisma,
  ): CollectionAppointmentEntity {
    return new CollectionAppointmentEntity({
      id: data.id,
      status:
        StatusCollectionAppointment[
          data.status as keyof typeof StatusCollectionAppointment
        ],
      scheduleFor: data.scheduleFor,
      reasonForCancellation: data.reasonForCancellation,
      company: {
        id: data.company.id,
        corporateName: data.company.corporateName,
      },
      customer: {
        userId: data.customer.id,
        profile: {
          id: data.customer.profile!.id,
          fullName: data.customer.profile!.fullName,
          phone: data.customer.profile!.phone,
          address: data.customer.profile!.address!,
        },
      },
      wastes: data.wastes.map((waste) => ({
        id: waste.id,
        name: waste.name,
      })),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}
