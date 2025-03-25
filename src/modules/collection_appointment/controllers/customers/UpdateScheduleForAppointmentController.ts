import { Request, Response } from "express";
import { z } from "zod";
import CollectionAppointmentControllerFactory from "./factories/CollectionAppointmentControllerFactory";
import { UpdateScheduleForAppointmentService } from "../../services/customers/UpdateScheduleForAppointmentService";

const updateAppointmentBodySchemaValidation = z.object({
  scheduleFor: z.string().transform((value) => new Date(value)),
});

const requestParamsSchemaValidation = z.object({
  appointmentId: z.string().uuid(),
});

export class UpdateScheduleForAppointmentController {
  async handle(request: Request, response: Response) {
    const { appointmentId } = requestParamsSchemaValidation.parse(
      request.params,
    );
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
