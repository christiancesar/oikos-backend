import { AppError } from "@common/errors/AppError";
import { ItemEntity } from "@modules/companies/entities/Item";
import { ICompaniesRepository } from "@modules/companies/repositories/ICompaniesRepository";

type ListWasteItemsServiceParams = {
  companyId: string;
};
export class ListWasteItemsService {
  constructor(private companiesRepository: ICompaniesRepository) {}

  async execute({
    companyId,
  }: ListWasteItemsServiceParams): Promise<ItemEntity[]> {
    const company = await this.companiesRepository.findCompayById(companyId);

    if (!company) {
      throw new AppError("Company not found");
    }

    return this.companiesRepository.listWasteItemsByCompanyId(companyId);
  }
}
