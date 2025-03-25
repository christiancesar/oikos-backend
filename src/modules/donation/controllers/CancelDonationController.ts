import { Request, Response } from "express";
import { DonationsRepository } from "../repositories/DonationsRepository";
import { CancelDonationService } from "../services/CancelDonationService";
import { UsersRepository } from "@modules/users/repositories/prisma/UsersRepository";
import { z } from "zod";

const requestParamsSchemaValidation = z.object({
  donationId: z.string().uuid(),
});

const requestBodySchemaValidation = z.object({
  reason: z.string().min(1).max(255),
});
export class CancelDonationController {
  async handle(request: Request, response: Response) {
    const { donationId } = requestParamsSchemaValidation.parse(request.params);
    const userId = request.user.id;
    const { reason } = requestBodySchemaValidation.parse(request.body);

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
