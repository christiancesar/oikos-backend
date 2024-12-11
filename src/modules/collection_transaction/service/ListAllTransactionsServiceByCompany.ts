import { ICompaniesRepository } from "@modules/companies/repositories/ICompaniesRepository";
import { CollectionTransactionEntity } from "../entities/CollectionTransaction";
import { ICollectionTransactionsRepository } from "../repositories/ICollectionTransactions";
import { AppError } from "@common/errors/AppError";

type ListAllTransactionsServiceByCompanyConstructor = {
  collectionTransactionsRepository: ICollectionTransactionsRepository;
  companiesRepository: ICompaniesRepository;
};

export class ListAllTransactionsServiceByCompany {
  constructor(
    private repositories: ListAllTransactionsServiceByCompanyConstructor,
  ) {}

  async execute(companyId: string): Promise<CollectionTransactionEntity[]> {
    const companyExist =
      await this.repositories.companiesRepository.findCompayById(companyId);

    if (!companyExist) {
      throw new AppError("Company not found");
    }

    const transactions =
      await this.repositories.collectionTransactionsRepository.listCollectionTransactionsByCompanyId(
        companyId,
      );

    return transactions;
  }
}
