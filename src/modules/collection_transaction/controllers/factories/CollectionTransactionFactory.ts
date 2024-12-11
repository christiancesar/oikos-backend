import { CollectionTransactionsRepository } from "@modules/collection_transaction/repositories/CollectionTransactionsRepository";
import { CompaniesRepository } from "@modules/companies/repositories/CompaniesRepository";
import { MaterialRepository } from "@modules/material/repositories/MaterialRegistrationRepository";

class CollectionTransactionFactory {
  make() {
    return {
      collectionTransactionsRepository: new CollectionTransactionsRepository(),
      companiesRepository: new CompaniesRepository(),
      materialsRepository: new MaterialRepository(),
    };
  }
}

export default new CollectionTransactionFactory();
