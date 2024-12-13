import { CompanyEntity } from "@modules/companies/entities/Companies";
import { ICompaniesRepository } from "@modules/companies/repositories/ICompaniesRepository";

type SeachWasteItems = {
  company?: string;
  waste?: string;
  category?: string;
};

export class SearchWasteItemService {
  constructor(private companiesRepository: ICompaniesRepository) {}

  async execute(search: SeachWasteItems): Promise<CompanyEntity[]> {
    let companies: CompanyEntity[] = [];
    companies = await this.companiesRepository.searchWasteItemsByCompanyNames({
      category: search.category ?? "",
      company: search.company ?? "",
      waste: search.waste ?? "",
    });
    return companies;
  }
}
