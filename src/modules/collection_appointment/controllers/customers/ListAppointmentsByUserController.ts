import { Request, Response } from "express";
import CollectionAppointmentControllerFactory from "./factories/CollectionAppointmentControllerFactory";
import { ListAppointmentsByUserService } from "../../services/customers/ListAppointmentsByUserService";

export class ListAppointmentsByUserController {
  async handle(request: Request, response: Response) {
    const userId = request.user.id;
    const repositories = CollectionAppointmentControllerFactory.make();
    const service = new ListAppointmentsByUserService(repositories);
    const appointments = await service.execute({
      userId,
    });

    response.json({ appointments });
  }
}
