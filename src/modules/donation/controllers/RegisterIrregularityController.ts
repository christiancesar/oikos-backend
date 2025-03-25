import { Request, Response } from "express";
import { RegisterIrregularityService } from "../services/RegisterIrregularityService";
import { DonationsRepository } from "../repositories/DonationsRepository";
import { UsersRepository } from "@modules/users/repositories/prisma/UsersRepository";
import { z } from "zod";

const requestParamsSchemaValidation = z.object({
  donationId: z.string().uuid(),
});

const requestBodySchemaValidation = z.object({
  reason: z.string().min(1).max(255),
});

export class RegisterIrregularityController {
  async handle(request: Request, response: Response) {
    const userId = request.user.id;
    const { donationId } = requestParamsSchemaValidation.parse(request.params);
    const { reason } = requestBodySchemaValidation.parse(request.body);

    const usersRepository = new UsersRepository();
    const donationsRepository = new DonationsRepository();
    const services = new RegisterIrregularityService(
      donationsRepository,
      usersRepository,
    );

    const donation = await services.execute(donationId, userId, reason);

    response.json(donation);
  }
}
