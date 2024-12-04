import { CompaniesRepository } from "@modules/companies/repositories/CompaniesRepository";
import { UpdateAddressCompanyService } from "@modules/companies/services/address/UpdateAddressProfileService";
import { Request, Response } from "express";

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

export class UpdateAddressCompanyController {
  public async handle(request: Request, response: Response) {
    const { companyId } = request.params;
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
