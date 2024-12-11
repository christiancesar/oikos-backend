import { ShowAppointmentByCompanyService } from "@modules/collection_appointment/services/companies/ShowAppointmentByCompanyService";
import { Request, Response } from "express";
import CompaniesCollectionAppointmentControllerFactory from "./factories/CompaniesCollectionAppointmentControllerFactory";

export class ShowAppointmentByCompanyController {
  async handle(request: Request, response: Response) {
    const { companyId, appointmentId } = request.params;

    const repositories = CompaniesCollectionAppointmentControllerFactory.make();
    const service = new ShowAppointmentByCompanyService(repositories);
    const appointment = await service.execute({
      companyId,
      appointmentId,
    });

    response.json({ appointment });
  }
}
