import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { ICollectionAppointmentsRepository } from "../../repositories/ICollectionAppointmentsRepository";
import { CollectionAppointmentEntity } from "../../entities/CollectionAppointment";
import { AppError } from "@common/errors/AppError";

type ShowAppointmentServiceConsteructor = {
  collectionAppointmentsRepository: ICollectionAppointmentsRepository;
  usersRepository: IUsersRepository;
};

type ShowAppointment = {
  userId: string;
  appointmentId: string;
};

export class ShowAppointmentService {
  constructor(private repositories: ShowAppointmentServiceConsteructor) {}

  async execute({
    userId,
    appointmentId,
  }: ShowAppointment): Promise<CollectionAppointmentEntity> {
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

    return appointmentExist;
  }
}
