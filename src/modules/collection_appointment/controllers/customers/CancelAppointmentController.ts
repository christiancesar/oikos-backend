import { Request, Response } from "express";
import CollectionAppointmentControllerFactory from "./factories/CollectionAppointmentControllerFactory";
import { CancelAppointmentService } from "../../services/customers/CancelAppointmentService";
import { z } from "zod";

const cancelAppointmentBodySchemaValidation = z.object({
  reason: z.string().min(15).max(255),
});

const requestParamsSchemaValidation = z.object({
  appointmentId: z.string().uuid(),
});

export class CancelAppointmentController {
  async handle(request: Request, response: Response) {
    const { appointmentId } = requestParamsSchemaValidation.parse(
      request.params,
    );
    const userId = request.user.id;
    const { reason } = cancelAppointmentBodySchemaValidation.parse(
      request.body,
    );

    const repositories = CollectionAppointmentControllerFactory.make();
    const service = new CancelAppointmentService(repositories);
    const appointment = await service.execute({
      appointmentId,
      reason,
      userId,
    });

    response.json({ appointment });
  }
}
