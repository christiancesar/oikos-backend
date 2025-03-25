import { CompaniesRepository } from "@modules/companies/repositories/CompaniesRepository";
import { UpdateAddressCompanyService } from "@modules/companies/services/address/UpdateAddressProfileService";
import { Request, Response } from "express";
import { z } from "zod";

type UpdateAddressCompanyRequestBody = {
  address: {
    street: string;
    number: string;
    complement?: string;
    district: string;
    city: string;
    state: string;
    stateAcronym: string;
    zipCode: string;
    latitude: number;
    longitude: number;
  };
};

const requestParamsSchemaValidation = z.object({
  companyId: z.string().uuid(),
});
export class UpdateAddressCompanyController {
  public async handle(request: Request, response: Response) {
    const { companyId } = requestParamsSchemaValidation.parse(request.params);
    const { address } = request.body as UpdateAddressCompanyRequestBody;
    const companiesRepository = new CompaniesRepository();
    const updateAddressCompanyService = new UpdateAddressCompanyService(
      companiesRepository,
    );
    const addressCompany = await updateAddressCompanyService.execute({
      companyId,
      address,
    });

    response.json(addressCompany);
  }
}
