import { CompaniesRepository } from "@modules/companies/repositories/CompaniesRepository";
import { FindCompanyService } from "@modules/companies/services/company/FindCompanyService";
import { Request, Response } from "express";
import { z } from "zod";

const requestParamsSchemaValidation = z.object({
  companyId: z.string().uuid(),
});
export class GetCompanyController {
  async handle(request: Request, response: Response) {
    const { companyId } = requestParamsSchemaValidation.parse(request.params);
    const companiesRepository = new CompaniesRepository();
    const findCompanyService = new FindCompanyService(companiesRepository);
    const company = await findCompanyService.execute(companyId);
    response.json(company);
  }
}
