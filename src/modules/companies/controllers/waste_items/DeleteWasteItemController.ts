import { CompaniesRepository } from "@modules/companies/repositories/CompaniesRepository";
import { DeleteWasteItemService } from "@modules/companies/services/waste_items/DeleteWasteItemService";
import { Request, Response } from "express";
import { z } from "zod";

const requestParamsSchemaValidation = z.object({
  companyId: z.string().uuid(),
  wasteId: z.string().uuid(),
});

export class DeleteWasteItemController {
  public async handle(request: Request, response: Response): Promise<void> {
    const { companyId, wasteId } = requestParamsSchemaValidation.parse(
      request.params,
    );

    const companiesRepository = new CompaniesRepository();

    const deleteWasteItemService = new DeleteWasteItemService(
      companiesRepository,
    );

    await deleteWasteItemService.execute({
      companyId,
      wasteId,
    });
    response.json().status(204);
  }
}
