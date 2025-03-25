import { Request, Response } from "express";
import { CompaniesRepository } from "../../repositories/CompaniesRepository";
import { CreateAddressCompanyService } from "@modules/companies/services/address/CreateAddressCompanyService";
import { z } from "zod";

type CreateAddressCompanyRequestBody = {
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

export class CreateAddressCompanyController {
  public async handle(request: Request, response: Response) {
    const { companyId } = requestParamsSchemaValidation.parse(request.params);
    const { address } = request.body as CreateAddressCompanyRequestBody;
    const companiesRepository = new CompaniesRepository();
    const createAddressCompanyService = new CreateAddressCompanyService(
      companiesRepository,
    );
    const addressCompany = await createAddressCompanyService.execute({
      companyId,
      address,
    });

    response.json(addressCompany);
  }
}
