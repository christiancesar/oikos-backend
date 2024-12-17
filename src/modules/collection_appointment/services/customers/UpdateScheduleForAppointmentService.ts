import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { ICollectionAppointmentsRepository } from "../../repositories/ICollectionAppointmentsRepository";
import { StatusCollectionAppointment } from "../../entities/CollectionAppointment";
import { AppError } from "@common/errors/AppError";

type ShowAppointmentServiceConsteructor = {
  collectionAppointmentsRepository: ICollectionAppointmentsRepository;
  usersRepository: IUsersRepository;
};

export class UpdateScheduleForAppointmentService {
  constructor(private repositories: ShowAppointmentServiceConsteructor) {}

  async execute({
    userId,
    appointmentId,
    scheduleFor,
  }: {
    userId: string;
    appointmentId: string;
    scheduleFor: Date;
  }) {
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
      throw new AppError("User not authorized get this appointment");
    }

    if (appointmentExist.status === StatusCollectionAppointment.CANCELED) {
      throw new AppError(
        "Appointment already canceled, you can't update the schedule",
      );
    }

    const appointment =
      await this.repositories.collectionAppointmentsRepository.updateScheduleForAppointment(
        {
          customerId: userId,
          appointmentId,
          scheduleFor,
        },
      );

    return appointment;
  }
}
