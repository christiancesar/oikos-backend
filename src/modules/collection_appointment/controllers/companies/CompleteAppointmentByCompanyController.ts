import { Request, Response } from "express";
import { CompletedAppointmentByCompanyService } from "@modules/collection_appointment/services/companies/CompleteAppointmentByCompanyService";
import { CollectionTransactionsRepository } from "@modules/collection_transaction/repositories/CollectionTransactionsRepository";
import CompaniesCollectionAppointmentControllerFactory from "./factories/CompaniesCollectionAppointmentControllerFactory";
import { z } from "zod";

const requestParamsSchemaValidation = z.object({
  companyId: z.string(),
  appointmentId: z.string(),
});

export class CompleteAppointmentByCompanyController {
  async handle(request: Request, response: Response) {
    const { companyId, appointmentId } = requestParamsSchemaValidation.parse(
      request.params,
    );

    const repositories = CompaniesCollectionAppointmentControllerFactory.make();
    const collectionTransactionsRepository =
      new CollectionTransactionsRepository();
    const service = new CompletedAppointmentByCompanyService({
      ...repositories,
      collectionTransactionsRepository,
    });
    const appointment = await service.execute({
      companyId,
      appointmentId,
    });

    response.json({ appointment });
  }
}
