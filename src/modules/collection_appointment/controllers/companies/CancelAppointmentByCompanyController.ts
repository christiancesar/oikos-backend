import { Request, Response } from "express";
import CompaniesCollectionAppointmentControllerFactory from "./factories/CompaniesCollectionAppointmentControllerFactory";
import { CancelAppointmentByCompanyService } from "@modules/collection_appointment/services/companies/CancelAppointmentByCompanyService";
import { z } from "zod";

const cancelAppointmentBodySchemaValidation = z.object({
  reason: z.string().min(15).max(255),
});

const requestParamsSchemaValidation = z.object({
  companyId: z.string(),
  appointmentId: z.string(),
});
export class CancelAppointmentByCompanyController {
  async handle(request: Request, response: Response) {
    const { companyId, appointmentId } = requestParamsSchemaValidation.parse(
      request.params,
    );
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
