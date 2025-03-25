import { CompaniesRepository } from "@modules/companies/repositories/CompaniesRepository";
import { SearchWasteItemService } from "@modules/companies/services/search/SearchWasteItemService";
import { Request, Response } from "express";
import { z } from "zod";

const searchWasteItemQueryParamsSchemaValidation = z.object({
  company: z.string().optional(),
  waste: z.string().optional(),
  category: z.string().optional(),
  city: z.string(),
  page: z.preprocess((value) => Number(value), z.number()),
  perPage: z.preprocess((value) => Number(value), z.number()).optional(),
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
