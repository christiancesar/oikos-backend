import { AppError } from "@common/errors/AppError";
import {
  DonationCondition,
  DonationEntity,
  DonationStatus,
} from "../entities/Donation";
import { IDonationsRepository } from "../repositories/IDonationsRepository";

type SearchParams = {
  status?: string;
  condition?: string;
};

export class ListAllDonationService {
  constructor(private donationsRepository: IDonationsRepository) {}

  async execute(data?: SearchParams): Promise<DonationEntity[]> {
    if (data && data.condition) {
      if (
        ![DonationCondition.NEW, DonationCondition.USED].includes(
          data.condition as DonationCondition,
        )
      ) {
        throw new AppError("Invalid donation condition");
      }
    }

    if (data && data.status) {
      if (
        ![
          DonationStatus.OPEN,
          DonationStatus.ASSIGNED,
          DonationStatus.CLOSED,
          DonationStatus.CANCELLED,
          DonationStatus.COMPLETED,
        ].includes(data.status as DonationStatus)
      ) {
        throw new AppError("Invalid donation status");
      }
    }

    const donations = await this.donationsRepository.findAllDonations({
      condition: data?.condition,
      status: data?.status,
    });
    return donations;
  }
}
