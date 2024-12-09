import { UsersRepository } from "@modules/users/repositories/UsersRepository";
import { Request, Response } from "express";
import { DonationsRepository } from "../repositories/DonationsRepository";
import { CancelDonationService } from "../services/CancelDonationService";

export class CancelDonationController {
  async handle(request: Request, response: Response) {
    const { donationId } = request.params;
    const userId = request.user.id;
    const { reason } = request.body;

    const usersRepository = new UsersRepository();
    const donationsRepository = new DonationsRepository();
    const service = new CancelDonationService(
      donationsRepository,
      usersRepository,
    );

    const donation = await service.execute({ donationId, userId, reason });

    response.json(donation);
  }
}
