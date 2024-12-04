import { WasteType } from "@modules/companies/entities/Item";
import { CompaniesRepository } from "@modules/companies/repositories/CompaniesRepository";
import { CreateWasteItemService } from "@modules/companies/services/waste_items/CreateWasteItemService";
import { MaterialRepository } from "@modules/material/repositories/MaterialRegistrationRepository";
import { Request, Response } from "express";
import * as zod from "zod";

const CreateWasteItemControllerRequestBodySchema = zod.object({
  waste: zod.object({
    materialId: zod.string().uuid(),
    amount: zod.number(),
    unit: zod.string().min(1).max(2),
    wasteType: zod.nativeEnum(WasteType),
  }),
});

export class CreateWasteItemController {
  public async handle(request: Request, response: Response): Promise<void> {
    const { companyId } = request.params;
    const { waste } = CreateWasteItemControllerRequestBodySchema.parse(
      request.body,
    );

    const companiesRepository = new CompaniesRepository();
    const materialRepository = new MaterialRepository();
    const createWasteItemService = new CreateWasteItemService(
      companiesRepository,
      materialRepository,
    );

    const wasteItem = await createWasteItemService.execute({
      companyId,
      waste,
    });

    response.json(wasteItem);
  }
}
