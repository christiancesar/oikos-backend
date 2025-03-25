import { Request, Response } from "express";
import CollectionAppointmentControllerFactory from "./factories/CollectionAppointmentControllerFactory";
import { ShowAppointmentService } from "../../services/customers/ShowAppointmentService";
import { z } from "zod";

const requestParamsSchemaValidation = z.object({
  appointmentId: z.string().uuid(),
});

export class ShowAppointmentController {
  async handle(request: Request, response: Response) {
    const { appointmentId } = requestParamsSchemaValidation.parse(
      request.params,
    );
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
