import { Request, Response } from "express";
import CompaniesCollectionAppointmentControllerFactory from "./factories/CompaniesCollectionAppointmentControllerFactory";
import { CancelAppointmentByCompanyService } from "@modules/collection_appointment/services/companies/CancelAppointmentByCompanyService";
import * as zod from "zod";

const cancelAppointmentBodySchemaValidation = zod.object({
  reason: zod.string().min(15).max(255),
});

export class CancelAppointmentByCompanyController {
  async handle(request: Request, response: Response) {
    const { companyId, appointmentId } = request.params;
    const { reason } = cancelAppointmentBodySchemaValidation.parse(
      request.body,
    );

    const repositories = CompaniesCollectionAppointmentControllerFactory.make();
    const service = new CancelAppointmentByCompanyService(repositories);
    const appointment = await service.execute({
      companyId,
      appointmentId,
      reason,
    });

    response.json({ appointment });
  }
}
