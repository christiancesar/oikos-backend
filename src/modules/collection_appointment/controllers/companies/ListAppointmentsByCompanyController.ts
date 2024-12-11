import { ListAppointmentsByCompanyService } from "@modules/collection_appointment/services/companies/ListAppointmentsByCompanyService";
import { Request, Response } from "express";
import CompaniesCollectionAppointmentControllerFactory from "./factories/CompaniesCollectionAppointmentControllerFactory";

export class ListAppointmentsByCompanyController {
  async handle(request: Request, response: Response) {
    const { companyId } = request.params;

    const repositories = CompaniesCollectionAppointmentControllerFactory.make();
    const service = new ListAppointmentsByCompanyService(repositories);
    const appointment = await service.execute({
      companyId,
    });

    response.json({ appointment });
  }
}
