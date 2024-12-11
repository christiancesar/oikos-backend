import { Request, Response } from "express";
import CollectionAppointmentControllerFactory from "./factories/CollectionAppointmentControllerFactory";
import { CancelAppointmentService } from "../services/CancelAppointmentService";
import * as zod from "zod";

const cancelAppointmentBodySchemaValidation = zod.object({
  reason: zod.string().min(15).max(255),
});

export class CancelAppointmentController {
  async handle(request: Request, response: Response) {
    const { appointmentId } = request.params;
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
