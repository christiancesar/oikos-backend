import { Request, Response } from "express";
import { DonationsRepository } from "../repositories/DonationsRepository";
import { AssignDoneeService } from "../services/AssignDoneeService";
import { UsersRepository } from "@modules/users/repositories/prisma/UsersRepository";
import { z } from "zod";

const requestParamsSchemaValidation = z.object({
  donationId: z.string().uuid(),
});

export class AssignDoneeController {
  async handle(request: Request, response: Response) {
    const userId = request.user.id;
    const { donationId } = requestParamsSchemaValidation.parse(request.params);
    const donationsRepository = new DonationsRepository();
    const usersRepository = new UsersRepository();
    const assignDoneeService = new AssignDoneeService(
      donationsRepository,
      usersRepository,
    );

    const donation = await assignDoneeService.execute({
      donationId,
      doneeId: userId,
    });

    response.json(donation);
  }
}
