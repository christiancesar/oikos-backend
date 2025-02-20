import { CompaniesRepository } from "@modules/companies/repositories/CompaniesRepository";
import { SearchWasteItemService } from "@modules/companies/services/search/SearchWasteItemService";
import { Request, Response } from "express";
import * as zod from "zod";

const searchWasteItemQueryParamsSchemaValidation = zod.object({
  company: zod.string().optional(),
  waste: zod.string().optional(),
  category: zod.string().optional(),
  city: zod.string(),
  page: zod.preprocess((value) => Number(value), zod.number()),
  perPage: zod.preprocess((value) => Number(value), zod.number()).optional(),
});

export class SearchWasteItemController {
  async handle(request: Request, response: Response) {
    const { company, waste, category, city, page, perPage } =
      searchWasteItemQueryParamsSchemaValidation.parse(request.query);
    const companiesRepository = new CompaniesRepository();
    const service = new SearchWasteItemService(companiesRepository);

    const companies = await service.execute({
      company,
      waste,
      category,
      city,
      page,
      perPage,
    });

    response.json(companies);
  }
}
