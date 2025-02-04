import { CompanyEntity } from "@modules/companies/entities/Companies";
import { ICompaniesRepository } from "@modules/companies/repositories/ICompaniesRepository";

type SeachWasteItems = {
  company?: string;
  waste?: string;
  category?: string;
  city: string;
  page: number;
  perPage?: number;
};

type SearchWasteItemServiceResult = {
  companies: CompanyEntity[];
  currentPage: number;
  perPage: number;
  pageLimit: number;
  total: number;
};

export class SearchWasteItemService {
  constructor(private companiesRepository: ICompaniesRepository) {}

  async execute(
    search: SeachWasteItems,
  ): Promise<SearchWasteItemServiceResult> {
    const { companies, currentPage, pageLimit, perPage, total } =
      await this.companiesRepository.searchWasteItemsByCompanyNames({
        category: search.category ?? "",
        company: search.company ?? "",
        waste: search.waste ?? "",
        city: search.city,
        page: search.page,
        perPage: search.perPage,
      });

    return {
      companies,
      currentPage,
      perPage,
      pageLimit,
      total,
    };
  }
}
