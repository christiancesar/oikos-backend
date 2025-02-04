import { Request, Response } from "express";
import { RegisterIrregularityService } from "../services/RegisterIrregularityService";
import { DonationsRepository } from "../repositories/DonationsRepository";
import { UsersRepository } from "@modules/users/repositories/prisma/UsersRepository";

export class RegisterIrregularityController {
  async handle(request: Request, response: Response) {
    const userId = request.user.id;
    const { donationId } = request.params;
    const { reason } = request.body;

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
