import { Request, Response } from "express";
import { DonationsRepository } from "../repositories/DonationsRepository";
import { ShowDonationService } from "../services/ShowDonationService";

export class ShowDonationController {
  async handle(request: Request, response: Response) {
    const { donationId } = request.params;

    const donationRepository = new DonationsRepository();
    const service = new ShowDonationService(donationRepository);
    const donation = await service.execute(donationId);

    response.json(donation);
  }
}
