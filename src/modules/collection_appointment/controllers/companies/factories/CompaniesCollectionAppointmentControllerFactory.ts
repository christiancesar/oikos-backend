import { CollectionAppointmentsRepository } from "@modules/collection_appointment/repositories/CollectionAppointmentsRepository";
import { CompaniesRepository } from "@modules/companies/repositories/CompaniesRepository";

class CompaniesCollectionAppointmentControllerFactory {
  make() {
    return {
      companiesRepository: new CompaniesRepository(),
      collectionAppointmentsRepository: new CollectionAppointmentsRepository(),
    };
  }
}

export default new CompaniesCollectionAppointmentControllerFactory();
