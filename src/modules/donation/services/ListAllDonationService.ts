import { DonationEntity } from "../entities/Donation";
import { IDonationsRepository } from "../repositories/IDonationsRepository";

export class ListAllDonationService {
  constructor(private donationsRepository: IDonationsRepository) {}

  async execute(): Promise<DonationEntity[]> {
    const donations = await this.donationsRepository.findAllDonations();
    return donations;
  }
}
