import { AppError } from "@common/errors/AppError";
import { ICompaniesRepository } from "@modules/companies/repositories/ICompaniesRepository";

type DeleteWasteItemServiceParams = {
  companyId: string;
  wasteId: string;
};

export class DeleteWasteItemService {
  constructor(private companiesRepository: ICompaniesRepository) {}

  async execute({
    companyId,
    wasteId,
  }: DeleteWasteItemServiceParams): Promise<void> {
    const company = await this.companiesRepository.findCompayById(companyId);
    if (!company) {
      throw new AppError("Company not found");
    }

    const wasteExist =
      await this.companiesRepository.findWasteItemById(wasteId);

    if (!wasteExist) {
      throw new AppError("Waste item not found");
    }

    await this.companiesRepository.deleteWasteItemById({
      wasteId,
      companyId,
    });
  }
}
