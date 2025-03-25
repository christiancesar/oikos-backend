import { CollectionAppointmentsRepository } from "@modules/collection_appointment/repositories/CollectionAppointmentsRepository";
import { CompaniesRepository } from "@modules/companies/repositories/CompaniesRepository";
import { MaterialRepository } from "@modules/material/repositories/MaterialRegistrationRepository";
import { UsersRepository } from "@modules/users/repositories/prisma/UsersRepository";

class CollectionAppointmentControllerFactory {
  make() {
    return {
      companiesRepository: new CompaniesRepository(),
      usersRepository: new UsersRepository(),
      materialsRepository: new MaterialRepository(),
      collectionAppointmentsRepository: new CollectionAppointmentsRepository(),
    };
  }
}

export default new CollectionAppointmentControllerFactory();
