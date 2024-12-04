import { CompaniesRepository } from "@modules/companies/repositories/CompaniesRepository";
import { ListWasteItemsService } from "@modules/companies/services/waste_items/ListWasteItemsService";
import { Request, Response } from "express";

export class ListWasteItemsController {
  public async handle(request: Request, response: Response): Promise<void> {
    const { companyId } = request.params;

    const companiesRepository = new CompaniesRepository();

    const listWasteItemsService = new ListWasteItemsService(
      companiesRepository,
    );

    const waste = await listWasteItemsService.execute({
      companyId,
    });

    response.json(waste);
  }
}
