import { AppError } from "@common/errors/AppError";
import { IDonationsRepository } from "../repositories/IDonationsRepository";

type Attachments = {
  donationId: string;
  files: string[];
};

export class AssignAttachmentsToDonationService {
  constructor(private donationsRepository: IDonationsRepository) {}

  async execute({ donationId, files }: Attachments) {
    if (files.length === 0) {
      throw new AppError("No files provided");
    }

    files.forEach((file) => {
      if (file.trim() === "") {
        throw new AppError("File name cannot be empty");
      }
    });

    const donation =
      await this.donationsRepository.findByDonationId(donationId);
    if (!donation) {
      throw new AppError("Donation not found");
    }

    const urls = files.map((file) => {
      return `${process.env.URL}/storage/${file}`;
    });

    const donationWithAttachments =
      await this.donationsRepository.saveAttachments({
        donationId,
        urls,
      });

    return donationWithAttachments;
  }
}
