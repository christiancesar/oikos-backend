import { AppError } from "@common/errors/AppError";
import { IDonationsRepository } from "../repositories/IDonationsRepository";

export class ShowDonationService {
  constructor(private donationsRepository: IDonationsRepository) {}

  async execute(donationId: string) {
    const donation =
      await this.donationsRepository.findByDonationId(donationId);

    if (!donation) {
      throw new AppError("Donation not found");
    }

    return donation;
  }
}
