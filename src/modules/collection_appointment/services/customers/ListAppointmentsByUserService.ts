import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import { ICollectionAppointmentsRepository } from "../../repositories/ICollectionAppointmentsRepository";
import { CollectionAppointmentEntity } from "../../entities/CollectionAppointment";
import { AppError } from "@common/errors/AppError";

type ListAppointmentsByUserServiceConsteructor = {
  collectionAppointmentsRepository: ICollectionAppointmentsRepository;
  usersRepository: IUsersRepository;
};

export class ListAppointmentsByUserService {
  constructor(
    private repositories: ListAppointmentsByUserServiceConsteructor,
  ) {}

  async execute({
    userId,
  }: {
    userId: string;
  }): Promise<CollectionAppointmentEntity[]> {
    const userExist =
      await this.repositories.usersRepository.findByUserId(userId);

    if (!userExist) {
      throw new AppError("User not found");
    }

    const appointments =
      await this.repositories.collectionAppointmentsRepository.listCollectionAppointmentByCustomerId(
        { customerId: userId },
      );

    return appointments;
  }
}
