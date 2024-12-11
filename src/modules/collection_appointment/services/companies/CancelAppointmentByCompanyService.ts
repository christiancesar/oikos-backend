import { AppError } from "@common/errors/AppError";
import { StatusCollectionAppointment } from "@modules/collection_appointment/entities/CollectionAppointment";
import { ICollectionAppointmentsRepository } from "@modules/collection_appointment/repositories/ICollectionAppointmentsRepository";
import { ICompaniesRepository } from "@modules/companies/repositories/ICompaniesRepository";

type CancelAppointmentByCompanyServiceConsteructor = {
  collectionAppointmentsRepository: ICollectionAppointmentsRepository;
  companiesRepository: ICompaniesRepository;
};

type CancelAppointment = {
  companyId: string;
  appointmentId: string;
  reason: string;
};

export class CancelAppointmentByCompanyService {
  constructor(
    private repositories: CancelAppointmentByCompanyServiceConsteructor,
  ) {}

  async execute({ companyId, appointmentId, reason }: CancelAppointment) {
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
        "Company does not have permission to cancel this appointment",
      );
    }

    if (appointmentExist.status === StatusCollectionAppointment.CANCELED) {
      throw new AppError("Appointment already canceled");
    }

    const appointment =
      await this.repositories.collectionAppointmentsRepository.cancelCollectionAppointmentByCompanyId(
        {
          companyId,
          appointmentId,
          reason,
        },
      );

    return appointment;
  }
}
