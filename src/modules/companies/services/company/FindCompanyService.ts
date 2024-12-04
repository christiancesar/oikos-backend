import { AppError } from "@common/errors/AppError";
import { ICompaniesRepository } from "../../repositories/ICompaniesRepository";

export class FindCompanyService {
  constructor(private companiesRepository: ICompaniesRepository) {}
  async execute(companyId: string) {
    const companyExist =
      await this.companiesRepository.findCompayById(companyId);
    if (!companyExist) {
      throw new AppError("Company not found");
    }
    return companyExist;
  }
}
