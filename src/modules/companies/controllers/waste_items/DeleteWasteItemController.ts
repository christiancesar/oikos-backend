import { CompaniesRepository } from "@modules/companies/repositories/CompaniesRepository";
import { DeleteWasteItemService } from "@modules/companies/services/waste_items/DeleteWasteItemService";
import { Request, Response } from "express";

export class DeleteWasteItemController {
  public async handle(request: Request, response: Response): Promise<void> {
    const { companyId, wasteId } = request.params;

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
