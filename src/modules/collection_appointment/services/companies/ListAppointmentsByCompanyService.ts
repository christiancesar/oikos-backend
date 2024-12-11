import { AppError } from "@common/errors/AppError";
import { ICollectionAppointmentsRepository } from "@modules/collection_appointment/repositories/ICollectionAppointmentsRepository";
import { ICompaniesRepository } from "@modules/companies/repositories/ICompaniesRepository";

type ListAppointmentsByCompanyServiceConsteructor = {
  collectionAppointmentsRepository: ICollectionAppointmentsRepository;
  companiesRepository: ICompaniesRepository;
};

type ListAppointments = {
  companyId: string;
};
export class ListAppointmentsByCompanyService {
  constructor(
    private repositories: ListAppointmentsByCompanyServiceConsteructor,
  ) {}

  async execute({ companyId }: ListAppointments) {
    const companyExist =
      await this.repositories.companiesRepository.findCompayById(companyId);

    if (!companyExist) {
      throw new AppError("Company not found");
    }

    const appointments =
      await this.repositories.collectionAppointmentsRepository.listCollectionAppointmentsByCompanyId(
        {
          companyId,
        },
      );

    return appointments;
  }
}
