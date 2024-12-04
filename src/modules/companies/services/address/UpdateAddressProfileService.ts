import { AppError } from "@common/errors/AppError";
import { ICompaniesRepository } from "../../repositories/ICompaniesRepository";

type UpdateAddressCompanyServiceParams = {
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
export class UpdateAddressCompanyService {
  constructor(private companiesRepository: ICompaniesRepository) {}
  async execute({ companyId, address }: UpdateAddressCompanyServiceParams) {
    const companyExist =
      await this.companiesRepository.findCompayById(companyId);
    if (!companyExist) {
      throw new AppError("Company does not exist");
    }

    const company = await this.companiesRepository.updateAddress({
      companyId,
      address,
    });

    return company;
  }
}
