import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { IDonationsRepository } from "../repositories/IDonationsRepository";
import { DonationCondition, DonationEntity } from "../entities/Donation";
import { AppError } from "@common/errors/AppError";

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
      throw new AppError("User not found");
    }

    if (
      ![DonationCondition.NEW, DonationCondition.USED].includes(
        DonationCondition[data.condition as keyof typeof DonationCondition],
      )
    ) {
      throw new AppError("Invalid donation condition");
    }

    return this.donationRepository.createDonation(data);
  }
}
