import { AppError } from "@common/errors/AppError";
import { StatusCollectionAppointment } from "@modules/collection_appointment/entities/CollectionAppointment";
import { ICollectionAppointmentsRepository } from "@modules/collection_appointment/repositories/ICollectionAppointmentsRepository";
import { ICompaniesRepository } from "@modules/companies/repositories/ICompaniesRepository";

type ConfirmationAppointmentByCompanyServiceConsteructor = {
  collectionAppointmentsRepository: ICollectionAppointmentsRepository;
  companiesRepository: ICompaniesRepository;
};

type ConfirmationAppointment = {
  companyId: string;
  appointmentId: string;
};
export class ConfirmationAppointmentByCompanyService {
  constructor(
    private repositories: ConfirmationAppointmentByCompanyServiceConsteructor,
  ) {}

  async execute({ companyId, appointmentId }: ConfirmationAppointment) {
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
        "Company does not have permission to confirm this appointment",
      );
    }

    if (appointmentExist.status === StatusCollectionAppointment.CANCELED) {
      throw new AppError("Appointment already canceled");
    }

    if (appointmentExist.status === StatusCollectionAppointment.CONFIRMED) {
      throw new AppError("Appointment already confirmed");
    }

    const appointment =
      await this.repositories.collectionAppointmentsRepository.confirmationCollectionAppointmentCompayId(
        {
          companyId,
          appointmentId,
        },
      );

    return appointment;
  }
}
