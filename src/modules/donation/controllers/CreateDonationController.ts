import { Request, Response } from "express";
import { z } from "zod";
import { DonationCondition } from "../entities/Donation";
import { DonationsRepository } from "../repositories/DonationsRepository";
import { CreateDonationService } from "../services/CreateDonationService";
import { UsersRepository } from "@modules/users/repositories/prisma/UsersRepository";

const createDonationBodySchemaValidation = z.object({
  description: z.string().min(150),
  quantity: z.number().min(1),
  condition: z.nativeEnum(DonationCondition),
  additionalNotes: z.string(),
});

export class CreateDonationController {
  async handle(request: Request, response: Response) {
    const userId = request.user.id;
    const { description, quantity, condition, additionalNotes } =
      createDonationBodySchemaValidation.parse(request.body);

    const usersRepository = new UsersRepository();
    const donationsRepository = new DonationsRepository();
    const createDonationService = new CreateDonationService(
      donationsRepository,
      usersRepository,
    );

    const donation = await createDonationService.execute({
      description,
      quantity,
      condition,
      additionalNotes,
      donorId: userId,
    });

    response.json(donation);
  }
}
