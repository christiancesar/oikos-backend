import { Request, Response } from "express";
import { ConfirmationAppointmentByCompanyService } from "@modules/collection_appointment/services/companies/ConfirmationAppointmentByCompanyService";
import CompaniesCollectionAppointmentControllerFactory from "./factories/CompaniesCollectionAppointmentControllerFactory";

export class ConfirmationAppointmentByCompanyController {
  async handle(request: Request, response: Response) {
    const { companyId, appointmentId } = request.params;

    const repositories = CompaniesCollectionAppointmentControllerFactory.make();
    const service = new ConfirmationAppointmentByCompanyService(repositories);
    const appointment = await service.execute({
      companyId,
      appointmentId,
    });

    response.json({ appointment });
  }
}
