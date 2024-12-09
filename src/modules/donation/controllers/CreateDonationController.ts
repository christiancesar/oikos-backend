import { UsersRepository } from "@modules/users/repositories/UsersRepository";
import { Request, Response } from "express";
import * as zod from "zod";
import { DonationCondition } from "../entities/Donation";
import { DonationsRepository } from "../repositories/DonationsRepository";
import { CreateDonationService } from "../services/CreateDonationService";

const createDonationBodySchemaValidation = zod.object({
  description: zod.string().min(150),
  quantity: zod.number().min(1),
  condition: zod.nativeEnum(DonationCondition),
  additionalNotes: zod.string(),
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
