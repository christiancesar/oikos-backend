import { AppError } from "@common/errors/AppError";
import { ICompaniesRepository } from "../../repositories/ICompaniesRepository";

type CreateAddressCompanyServiceParams = {
  companyId: string;
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
export class CreateAddressCompanyService {
  constructor(private companiesRepository: ICompaniesRepository) {}
  async execute({ companyId, address }: CreateAddressCompanyServiceParams) {
    const companyExist =
      await this.companiesRepository.findCompayById(companyId);
    if (!companyExist) {
      throw new AppError("Company does not exist");
    }

    const company = await this.companiesRepository.createAddress({
      companyId,
      address,
    });

    return company;
  }
}
