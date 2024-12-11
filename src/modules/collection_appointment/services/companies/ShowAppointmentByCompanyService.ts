import { AppError } from "@common/errors/AppError";
import { ICollectionAppointmentsRepository } from "@modules/collection_appointment/repositories/ICollectionAppointmentsRepository";
import { ICompaniesRepository } from "@modules/companies/repositories/ICompaniesRepository";

type ShowAppointmentByCompanyServiceConsteructor = {
  collectionAppointmentsRepository: ICollectionAppointmentsRepository;
  companiesRepository: ICompaniesRepository;
};

type ShowAppointment = {
  companyId: string;
  appointmentId: string;
};
export class ShowAppointmentByCompanyService {
  constructor(
    private repositories: ShowAppointmentByCompanyServiceConsteructor,
  ) {}

  async execute({ companyId, appointmentId }: ShowAppointment) {
    const companyExist =
      await this.repositories.companiesRepository.findCompayById(companyId);

    if (!companyExist) {
      throw new AppError("Company not found");
    }

    const appointmentExist =
      await this.repositories.collectionAppointmentsRepository.findCollectionAppointmentById(
        {
          appointmentId,
        },
      );

    if (!appointmentExist) {
      throw new AppError("Appointment not found");
    }

    if (appointmentExist.company.id !== companyId) {
      throw new AppError(
        "Company does not have permission to view this appointment",
      );
    }

    const appointment =
      await this.repositories.collectionAppointmentsRepository.findCollectionAppointmentByCompanyId(
        {
          companyId,
          appointmentId,
        },
      );

    return appointment;
  }
}
