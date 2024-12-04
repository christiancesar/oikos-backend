import { AppError } from "@common/errors/AppError";
import { ICompaniesRepository } from "../../repositories/ICompaniesRepository";

export class GetAddressCompanyService {
  constructor(private companiesRepository: ICompaniesRepository) {}

  async execute(compranyId: string) {
    const companyExist =
      await this.companiesRepository.findCompayById(compranyId);
    if (!companyExist) {
      throw new AppError("Company not found");
    }

    const address =
      await this.companiesRepository.findAddressByCompaniesId(compranyId);

    return address;
  }
}
