import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import { IDonationsRepository } from "../repositories/IDonationsRepository";
import { DonationEntity } from "../entities/Donation";

export type CreateDonationServiceParams = {
  description: string;
  quantity: number;
  condition: string;
  additionalNotes: string;
  donorId: string;
};

export class CreateDonationService {
  constructor(
    private donationRepository: IDonationsRepository,
    private usersRepository: IUsersRepository,
  ) {}

  async execute(data: CreateDonationServiceParams): Promise<DonationEntity> {
    const userExist = await this.usersRepository.findByUserId(data.donorId);

    if (!userExist) {
      throw new Error("User not found");
    }

    return this.donationRepository.createDonation(data);
  }
}
