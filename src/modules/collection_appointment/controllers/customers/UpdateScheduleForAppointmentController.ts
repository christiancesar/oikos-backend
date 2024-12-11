import { Request, Response } from "express";
import * as zod from "zod";
import CollectionAppointmentControllerFactory from "./factories/CollectionAppointmentControllerFactory";
import { UpdateScheduleForAppointmentService } from "../../services/customers/UpdateScheduleForAppointmentService";

const updateAppointmentBodySchemaValidation = zod.object({
  scheduleFor: zod.string().transform((value) => new Date(value)),
});
export class UpdateScheduleForAppointmentController {
  async handle(request: Request, response: Response) {
    const { appointmentId } = request.params;
    const userId = request.user.id;
    const { scheduleFor } = updateAppointmentBodySchemaValidation.parse(
      request.body,
    );

    const repositories = CollectionAppointmentControllerFactory.make();
    const service = new UpdateScheduleForAppointmentService(repositories);
    const appointments = await service.execute({
      userId,
      appointmentId,
      scheduleFor,
    });

    response.json({ appointments });
  }
}
