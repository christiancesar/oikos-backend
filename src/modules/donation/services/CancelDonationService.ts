import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { IDonationsRepository } from "../repositories/IDonationsRepository";
import { AppError } from "@common/errors/AppError";
import { DonationEntity, DonationStatus } from "../entities/Donation";

type CancelDonationParams = {
  donationId: string;
  userId: string;
  reason: string;
};
export class CancelDonationService {
  constructor(
    private donationsRepository: IDonationsRepository,
    private usersRepository: IUsersRepository,
  ) {}

  async execute({
    donationId,
    userId,
    reason,
  }: CancelDonationParams): Promise<DonationEntity> {
    const donationExist =
      await this.donationsRepository.findByDonationId(donationId);

    if (!donationExist) {
      throw new AppError("Donation not found");
    }

    const userExist = await this.usersRepository.findByUserId(userId);

    if (!userExist) {
      throw new AppError("User not found");
    }

    if (donationExist.donorId !== userId) {
      throw new AppError("You are not the donor of this donation");
    }

    if (
      [
        DonationStatus.COMPLETED,
        DonationStatus.CLOSED,
        DonationStatus.CANCELLED,
      ].includes(donationExist.status)
    ) {
      throw new AppError("Donation already cancelled, closed or completed");
    }

    const donation = await this.donationsRepository.markDonationAsCancelled({
      donationId,
      reason,
    });

    return donation;
  }
}
