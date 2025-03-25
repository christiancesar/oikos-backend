import { ShowAppointmentByCompanyService } from "@modules/collection_appointment/services/companies/ShowAppointmentByCompanyService";
import { Request, Response } from "express";
import CompaniesCollectionAppointmentControllerFactory from "./factories/CompaniesCollectionAppointmentControllerFactory";
import { z } from "zod";

const requestParamsSchemaValidation = z.object({
  companyId: z.string().uuid(),
  appointmentId: z.string().uuid(),
});
export class ShowAppointmentByCompanyController {
  async handle(request: Request, response: Response) {
    const { companyId, appointmentId } = requestParamsSchemaValidation.parse(
      request.params,
    );

    const repositories = CompaniesCollectionAppointmentControllerFactory.make();
    const service = new ShowAppointmentByCompanyService(repositories);
    const appointment = await service.execute({
      companyId,
      appointmentId,
    });

    response.json({ appointment });
  }
}
