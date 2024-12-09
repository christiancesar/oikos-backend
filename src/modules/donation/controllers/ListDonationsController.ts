import { Request, Response } from "express";

import { DonationsRepository } from "../repositories/DonationsRepository";
import { ListAllDonationService } from "../services/ListAllDonationService";

export class ListDonationsController {
  async handle(request: Request, response: Response) {
    const donationRepository = new DonationsRepository();
    const service = new ListAllDonationService(donationRepository);
    const donations = await service.execute();

    response.json(donations);
  }
}
