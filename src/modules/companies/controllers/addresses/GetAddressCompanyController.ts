import { CompaniesRepository } from "@modules/companies/repositories/CompaniesRepository";
import { GetAddressCompanyService } from "@modules/companies/services/address/GetAddressProfileService";
import { Request, Response } from "express";

export class GetAddressCompanyController {
  async handle(request: Request, response: Response): Promise<void> {
    const { companyId } = request.params;
    const companiesRepository = new CompaniesRepository();
    const getAddressCompanyService = new GetAddressCompanyService(
      companiesRepository,
    );

    const address = await getAddressCompanyService.execute(companyId);

    response.json(address);
  }
}
