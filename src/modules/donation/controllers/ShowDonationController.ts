import { Request, Response } from "express";
import { DonationsRepository } from "../repositories/DonationsRepository";
import { ShowDonationService } from "../services/ShowDonationService";
import { z } from "zod";

const requestParamsSchemaValidation = z.object({
  donationId: z.string().uuid(),
});

export class ShowDonationController {
  async handle(request: Request, response: Response) {
    const { donationId } = requestParamsSchemaValidation.parse(request.params);

    const donationRepository = new DonationsRepository();
    const service = new ShowDonationService(donationRepository);
    const donation = await service.execute(donationId);

    response.json(donation);
  }
}
