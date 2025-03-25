import { Request, Response } from "express";
import { z } from "zod";
import CollectionAppointmentControllerFactory from "./factories/CollectionAppointmentControllerFactory";
import { CreateAppointmentService } from "../../services/customers/CreateAppointmentService";

const createAppointmentBodySchemaValidation = z.object({
  companyId: z.string().uuid(),
  wastes: z.array(z.string().uuid()),
  scheduleFor: z.string().transform((value) => new Date(value)),
});

export class CreateAppointmentController {
  async handle(request: Request, response: Response) {
    const userId = request.user.id;
    const { companyId, scheduleFor, wastes } =
      createAppointmentBodySchemaValidation.parse(request.body);
    const repositories = CollectionAppointmentControllerFactory.make();
    const service = new CreateAppointmentService(repositories);

    const appointment = await service.execute({
      companyId,
      customerId: userId,
      wastes,
      scheduleFor,
    });

    response.json(appointment);
  }
}
