import { AppError } from "@common/errors/AppError";
import { CollectionTransactionEntity } from "../entities/CollectionTransaction";
import { ICollectionTransactionsRepository } from "../repositories/ICollectionTransactions";
import { ICompaniesRepository } from "@modules/companies/repositories/ICompaniesRepository";

type CanceledTransaction = {
  companyId: string;
  transactionId: string;
};

type CanceledTransactionServiceParams = {
  collectionTransactionsRepository: ICollectionTransactionsRepository;
  companiesRepository: ICompaniesRepository;
};

export class CanceledTransactionService {
  constructor(private repositories: CanceledTransactionServiceParams) {}

  async execute({
    companyId,
    transactionId,
  }: CanceledTransaction): Promise<CollectionTransactionEntity> {
    const companyExist =
      await this.repositories.companiesRepository.findCompayById(companyId);

    if (!companyExist) {
      throw new AppError("Company not found");
    }

    const transactionExist =
      await this.repositories.collectionTransactionsRepository.findCollectionTransactionById(
        transactionId,
      );
    if (!transactionExist) {
      throw new AppError("Transaction not found");
    }

    if (transactionExist.company.id !== companyId) {
      throw new AppError("Company does not own this transaction ");
    }

    const transaction =
      await this.repositories.collectionTransactionsRepository.cancelCollectionTransaction(
        {
          companyId,
          transactionId,
        },
      );

    return transaction;
  }
}
