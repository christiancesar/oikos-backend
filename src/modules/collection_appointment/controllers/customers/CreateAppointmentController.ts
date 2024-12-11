import { Request, Response } from "express";
import * as zod from "zod";
import CollectionAppointmentControllerFactory from "./factories/CollectionAppointmentControllerFactory";
import { CreateAppointmentService } from "../../services/customers/CreateAppointmentService";

const createAppointmentBodySchemaValidation = zod.object({
  companyId: zod.string().uuid(),
  wastes: zod.array(zod.string().uuid()),
  scheduleFor: zod.string().transform((value) => new Date(value)),
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
