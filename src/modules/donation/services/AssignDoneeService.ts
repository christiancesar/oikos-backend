import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import { IDonationsRepository } from "../repositories/IDonationsRepository";
import { AppError } from "@common/errors/AppError";
type AssignDoneeServiceParams = {
  doneeId: string;
  donationId: string;
};
export class AssignDoneeService {
  constructor(
    private donationsRepository: IDonationsRepository,
    private usersRepository: IUsersRepository,
  ) {}

  async execute({ donationId, doneeId }: AssignDoneeServiceParams) {
    const userExist = await this.usersRepository.findByUserId(doneeId);
    if (!userExist) {
      throw new AppError("User not found");
    }

    const donationExist =
      await this.donationsRepository.findByDonationId(donationId);
    if (!donationExist) {
      throw new AppError("Donation not found");
    }

    if (donationExist.donorId === doneeId) {
      throw new AppError("Donor cannot be the donee");
    }

    const donation = await this.donationsRepository.assignDonee(
      doneeId,
      donationId,
    );

    return donation;
  }
}
