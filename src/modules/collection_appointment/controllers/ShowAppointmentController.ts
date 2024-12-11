import { Request, Response } from "express";
import CollectionAppointmentControllerFactory from "./factories/CollectionAppointmentControllerFactory";
import { ShowAppointmentService } from "../services/ShowAppointmentService";

export class ShowAppointmentController {
  async handle(request: Request, response: Response) {
    const { appointmentId } = request.params;
    const userId = request.user.id;

    const repositories = CollectionAppointmentControllerFactory.make();
    const service = new ShowAppointmentService(repositories);
    const appointments = await service.execute({
      userId,
      appointmentId,
    });

    response.json({ appointments });
  }
}
