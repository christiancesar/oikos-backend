import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { IDonationsRepository } from "../repositories/IDonationsRepository";
import { AppError } from "@common/errors/AppError";
import {
  DonationEntity,
  DonationIrragularity,
  DonationStatus,
} from "../entities/Donation";

export class RegisterIrregularityService {
  constructor(
    private donationsRepository: IDonationsRepository,
    private usersRepository: IUsersRepository,
  ) {}

  async execute(
    donationId: string,
    userId: string,
    reason: string,
  ): Promise<DonationEntity> {
    const donationExist =
      await this.donationsRepository.findByDonationId(donationId);
    if (!donationExist) {
      throw new AppError("Donation not found");
    }

    const user = await this.usersRepository.findByUserId(userId);

    if (!user) {
      throw new AppError("User not found");
    }

    if (donationExist.donorId === user.id) {
      throw new AppError("Donor cannot report irregularity in your donation");
    }

    const userRegisteredIrregularity = donationExist.irregularities?.find(
      (irregularity) => irregularity.userId === user.id,
    );

    if (userRegisteredIrregularity) {
      throw new AppError("User already reported irregularity in this donation");
    }

    donationExist.addIrragularity(
      new DonationIrragularity({
        description: reason,
        type: "irregularity",
        userId: user.id,
      }),
    );

    if (
      [DonationStatus.COMPLETED, DonationStatus.CANCELLED].includes(
        donationExist.status,
      )
    ) {
      throw new AppError("Donation already completed or cancelled");
    }

    if (donationExist.status === DonationStatus.CLOSED) {
      await this.donationsRepository.closeDonation({
        donationId,
        reason: donationExist.reasonForClosed!,
      });
    }

    const donation = await this.donationsRepository.registerIrregularity({
      donationId,
      irregularities: JSON.stringify(donationExist.irregularities),
      irregularitiesQuantity: donationExist.irregularities?.length ?? 0,
    });

    return donation;
  }
}
