import { CompaniesRepository } from "@modules/companies/repositories/CompaniesRepository";
import { FindCompanyService } from "@modules/companies/services/company/FindCompanyService";
import { Request, Response } from "express";

export class GetCompanyController {
  async handle(request: Request, response: Response) {
    const { companyId } = request.params;
    const companiesRepository = new CompaniesRepository();
    const findCompanyService = new FindCompanyService(companiesRepository);
    const company = await findCompanyService.execute(companyId);
    response.json(company);
  }
}
