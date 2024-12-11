import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import { ICollectionAppointmentsRepository } from "../../repositories/ICollectionAppointmentsRepository";
import {
  CollectionAppointmentEntity,
  StatusCollectionAppointment,
} from "../../entities/CollectionAppointment";
import { AppError } from "@common/errors/AppError";

type CancelAppointmentServiceConsteructor = {
  collectionAppointmentsRepository: ICollectionAppointmentsRepository;
  usersRepository: IUsersRepository;
};
export class CancelAppointmentService {
  constructor(private repositories: CancelAppointmentServiceConsteructor) {}

  async execute({
    userId,
    appointmentId,
    reason,
  }: {
    userId: string;
    appointmentId: string;
    reason: string;
  }): Promise<CollectionAppointmentEntity> {
    const userExist =
      await this.repositories.usersRepository.findByUserId(userId);

    if (!userExist) {
      throw new AppError("User not found");
    }

    const appointmentExist =
      await this.repositories.collectionAppointmentsRepository.findCollectionAppointmentById(
        {
          appointmentId,
        },
      );

    if (!appointmentExist) {
      throw new AppError("Appointment not found");
    }

    if (appointmentExist.customer.userId !== userId) {
      throw new AppError("User not authorized to cancel this appointment");
    }

    if (appointmentExist.status === StatusCollectionAppointment.CANCELED) {
      throw new AppError("Appointment already canceled");
    }

    const appointment =
      await this.repositories.collectionAppointmentsRepository.cancelCollectionAppointment(
        {
          customerId: userId,
          appointmentId,
          reason,
        },
      );

    return appointment;
  }
}
