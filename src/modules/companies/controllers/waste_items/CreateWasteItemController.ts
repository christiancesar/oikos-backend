import { WasteType } from "@modules/companies/entities/Item";
import { CompaniesRepository } from "@modules/companies/repositories/CompaniesRepository";
import { CreateWasteItemService } from "@modules/companies/services/waste_items/CreateWasteItemService";
import { MaterialRepository } from "@modules/material/repositories/MaterialRegistrationRepository";
import { Request, Response } from "express";
import { z } from "zod";

const createWasteItemControllerRequestBodySchema = z.object({
  waste: z.object({
    materialId: z.string().uuid(),
    amount: z.number(),
    unit: z.string().min(1).max(2),
    wasteType: z.nativeEnum(WasteType),
  }),
});

const requestParamsSchemaValidation = z.object({
  companyId: z.string().uuid(),
});

export class CreateWasteItemController {
  public async handle(request: Request, response: Response): Promise<void> {
    const { companyId } = requestParamsSchemaValidation.parse(request.params);
    const { waste } = createWasteItemControllerRequestBodySchema.parse(
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
