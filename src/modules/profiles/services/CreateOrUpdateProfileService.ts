import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import { IProfileRepository } from "../repositories/IProfileRepository";
import { AppError } from "@common/errors/AppError";

type CreateOrUpdateProfileServiceParams = {
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  cpf: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    district: string;
    city: string;
    state: string;
    stateAcronym: string;
    zipCode: string;
    latitude: number;
    longitude: number;
  };
};

export class CreateOrUpdateProfileService {
  constructor(
    private profileRepository: IProfileRepository,
    private usersRepository: IUsersRepository,
  ) {}

  async execute({
    userId,
    firstName,
    lastName,
    phone,
    cpf,
    address,
  }: CreateOrUpdateProfileServiceParams) {
    const userExist = await this.usersRepository.findByUserId(userId);
    if (!userExist) {
      throw new AppError("Usuário não existe ou não autenticado");
    }

    const profile = await this.profileRepository.createOrUpdate({
      userId,
      firstName,
      lastName,
      phone,
      cpf,
      address,
    });

    return profile;
  }
}
