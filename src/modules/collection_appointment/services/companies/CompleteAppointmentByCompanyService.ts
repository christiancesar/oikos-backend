import { AppError } from "@common/errors/AppError";
import { StatusCollectionAppointment } from "@modules/collection_appointment/entities/CollectionAppointment";
import { ICollectionAppointmentsRepository } from "@modules/collection_appointment/repositories/ICollectionAppointmentsRepository";
import {
  CollectionTransactionEntity,
  CollectionType,
  TradingType,
  TransactionStatus,
} from "@modules/collection_transaction/entities/CollectionTransaction";
import { ICollectionTransactionsRepository } from "@modules/collection_transaction/repositories/ICollectionTransactions";
import { WasteType } from "@modules/companies/entities/Item";
import { unitOfMeasurement } from "@modules/companies/entities/MeasurementConst";
import { ICompaniesRepository } from "@modules/companies/repositories/ICompaniesRepository";

type CompletedAppointmentByCompanyServiceParams = {
  collectionAppointmentsRepository: ICollectionAppointmentsRepository;
  companiesRepository: ICompaniesRepository;
  collectionTransactionsRepository: ICollectionTransactionsRepository;
};

type CompletedAppointment = {
  companyId: string;
  appointmentId: string;
};

export class CompletedAppointmentByCompanyService {
  constructor(
    private repositories: CompletedAppointmentByCompanyServiceParams,
  ) {}

  async execute({ companyId, appointmentId }: CompletedAppointment) {
    const company =
      await this.repositories.companiesRepository.findCompayById(companyId);

    if (!company) {
      throw new AppError("Company not found");
    }

    const appointment =
      await this.repositories.collectionAppointmentsRepository.findCollectionAppointmentById(
        { appointmentId },
      );

    if (!appointment) {
      throw new AppError("Appointment not found");
    }

    if (appointment.company.id !== companyId) {
      throw new AppError("Company does not have permission to complete");
    }

    if (appointment.status === StatusCollectionAppointment.CANCELED) {
      throw new AppError("Appointment is canceled");
    }

    if (appointment.status === StatusCollectionAppointment.COMPLETED) {
      throw new AppError("Appointment is already completed");
    }

    const transactions = appointment.wastes.map((waste) => {
      return new CollectionTransactionEntity({
        collectionType: CollectionType.APPOINTMENT,
        wasteType: WasteType.RECYCLABLE,
        tradingType: TradingType.COLLECTION,
        measurement: unitOfMeasurement.KG,
        quantity: 0,
        unitAmount: 0,
        grossAmount: 0,
        discountAmount: 0,
        netAmount: 0,
        latitude: 0,
        longitude: 0,
        company: {
          id: company.id,
          corporateName: company.corporateName,
        },
        waste: {
          id: waste.id,
          name: waste.name,
        },
        status: TransactionStatus.ACTIVE,
      });
    });

    await Promise.all(
      transactions.map(
        async (transaction) =>
          await this.repositories.collectionTransactionsRepository.createCollectionTransaction(
            {
              appointmentId,
              companyId: transaction.company.id,
              wasteId: transaction.waste.id,
              collectionType: transaction.collectionType,
              wasteType: transaction.wasteType,
              tradingType: transaction.tradingType,
              measurement: transaction.measurement.symbol,
              quantity: transaction.quantity,
              unitAmount: transaction.unitAmount,
              grossAmount: transaction.grossAmount,
              discountAmount: transaction.discountAmount,
              netAmount: transaction.netAmount,
              latitude: transaction.latitude,
              longitude: transaction.longitude,
            },
          ),
      ),
    );

    const appointmentCompleted =
      await this.repositories.collectionAppointmentsRepository.completeAppointmentByCompany(
        {
          companyId,
          appointmentId,
        },
      );

    return appointmentCompleted;
  }
}
