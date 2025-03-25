import { ICompaniesRepository } from "@modules/companies/repositories/ICompaniesRepository";
import { CollectionAppointmentEntity } from "../../entities/CollectionAppointment";
import { IMaterialRepository } from "@modules/material/repositories/IMaterialRegistrationRepository";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { ICollectionAppointmentsRepository } from "../../repositories/ICollectionAppointmentsRepository";
import { AppError } from "@common/errors/AppError";

type CreateAppointmentConstructor = {
  companiesRepository: ICompaniesRepository;
  usersRepository: IUsersRepository;
  materialsRepository: IMaterialRepository;
  collectionAppointmentsRepository: ICollectionAppointmentsRepository;
};

export type CreateAppointmentDTO = {
  companyId: string;
  customerId: string;
  wastes: string[];
  scheduleFor: Date;
};

export class CreateAppointmentService {
  constructor(private repositories: CreateAppointmentConstructor) {}

  async execute(
    data: CreateAppointmentDTO,
  ): Promise<CollectionAppointmentEntity> {
    const company = await this.repositories.companiesRepository.findCompayById(
      data.companyId,
    );

    if (!company) {
      throw new AppError("Company not found");
    }

    if (!company.acceptAppointments) {
      throw new AppError("The company does not accept appointments");
    }

    if (!company.businessHours || company.businessHours.length === 0) {
      throw new AppError(
        "The company does not have business hours yet, try other company",
      );
    }

    // company.businessHours.forEach((businessHour) => {
    //   const dayOfWeek = parseInt(businessHour.dayOfWeek, 10);

    //   const dayOfWeekExist = dayOfWeek === data.scheduleFor.getDay();

    //   if (dayOfWeekExist) {
    //     if (businessHour.timeSlots.length === 0) {
    //       throw new AppError(
    //         "The company does not have time slots available for this day",
    //       );
    //     }

    //     const timeSlotExist = businessHour.timeSlots.some((timeSlot) => {
    //       const startTime = new Date(timeSlot.startTime);
    //       const endTime = new Date(timeSlot.endTime);

    //       return (
    //         data.scheduleFor.getTime() >= startTime.getTime() &&
    //         data.scheduleFor.getTime() <= endTime.getTime()
    //       );
    //     });

    //     if (!timeSlotExist) {
    //       throw new AppError(
    //         "The company does not have time slots available for this day",
    //       );
    //     }
    //   }
    // });

    const customer = await this.repositories.usersRepository.findByUserId(
      data.customerId,
    );

    if (!customer) {
      throw new AppError("Customer not found");
    }

    if (!customer.profile || !customer.profile.address) {
      throw new AppError(
        "To create a schedule, the Profile information must be complete.",
      );
    }

    await Promise.all(
      data.wastes.map(async (wasteId) => {
        const waste =
          await this.repositories.materialsRepository.findById(wasteId);

        if (!waste) {
          throw new AppError("Waste not found");
        }
      }),
    );

    if (!company.wasteItems || company.wasteItems.length === 0) {
      throw new AppError("The company does not have waste items available");
    }

    const wasteItemsIds = company.wasteItems.map(
      (wasteItem) => wasteItem.waste.id,
    );

    const wasteItemsExist = data.wastes.every((wasteId) => {
      return wasteItemsIds.includes(wasteId);
    });

    if (!wasteItemsExist) {
      throw new AppError(
        "The company does not have the waste items you selected",
      );
    }

    const appointment =
      await this.repositories.collectionAppointmentsRepository.createCollectionAppointment(
        {
          companyId: data.companyId,
          customerId: data.customerId,
          wastes: data.wastes,
          scheduleFor: data.scheduleFor,
        },
      );

    return appointment;
  }
}
