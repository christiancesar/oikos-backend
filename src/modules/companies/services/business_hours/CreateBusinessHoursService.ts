import { AppError } from "@common/errors/AppError";
import { TimeSlot } from "@modules/companies/entities/BusinessHour";
import { ICompaniesRepository } from "@modules/companies/repositories/ICompaniesRepository";

type CreateBusinessHoursServiceParams = {
  companyId: string;
  businessHours: {
    dayOfWeek: string;
    timeSlots: TimeSlot[];
  }[];
};

export class CreateBusinessHoursService {
  constructor(private companiesRepository: ICompaniesRepository) {}
  async execute({
    companyId,
    businessHours,
  }: CreateBusinessHoursServiceParams) {
    const companyExist =
      await this.companiesRepository.findCompayById(companyId);

    if (!companyExist) {
      throw new AppError("Company not found");
    }

    const businessHourExist =
      await this.companiesRepository.getBusinessHoursByCompanyId(companyId);
    if (businessHourExist.length > 0) {
      await this.companiesRepository.deleteBusinessHoursByCompanyId(companyId);
    }

    await Promise.all(
      businessHours.map(async (businessHour) => {
        await this.companiesRepository.createBusinessHours({
          companyId,
          businessHours: businessHour,
        });
      }),
    );

    const hours =
      this.companiesRepository.getBusinessHoursByCompanyId(companyId);

    return hours;
  }
}
