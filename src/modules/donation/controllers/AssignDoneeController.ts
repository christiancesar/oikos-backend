import { Request, Response } from "express";
import { DonationsRepository } from "../repositories/DonationsRepository";
import { AssignDoneeService } from "../services/AssignDoneeService";
import { UsersRepository } from "@modules/users/repositories/prisma/UsersRepository";

export class AssignDoneeController {
  async handle(request: Request, response: Response) {
    const userId = request.user.id;
    const { donationId } = request.params;
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
