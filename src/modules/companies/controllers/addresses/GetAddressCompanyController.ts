import { CompaniesRepository } from "@modules/companies/repositories/CompaniesRepository";
import { GetAddressCompanyService } from "@modules/companies/services/address/GetAddressProfileService";
import { Request, Response } from "express";
import { z } from "zod" 

const requestParamsSchemaValidation = z.object({
  companyId: z.string().uuid(),
});
export class GetAddressCompanyController {
  async handle(request: Request, response: Response): Promise<void> {
    const { companyId } = requestParamsSchemaValidation.parse(request.params);
    const companiesRepository = new CompaniesRepository();
    const getAddressCompanyService = new GetAddressCompanyService(
      companiesRepository,
    );

    const address = await getAddressCompanyService.execute(companyId);

    response.json(address);
  }
}
