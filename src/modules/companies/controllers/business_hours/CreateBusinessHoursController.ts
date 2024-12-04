import { Request, Response } from "express";

import { CompaniesRepository } from "@modules/companies/repositories/CompaniesRepository";
import { CreateBusinessHoursService } from "@modules/companies/services/business_hours/CreateBusinessHoursService";

type CreateBusinessHoursControllerRequestBody = {
  businessHours: {
    dayOfWeek: string;
    timeSlots: {
      startTime: string;
      endTime: string;
    }[];
  }[];
};
export class CreateBusinessHoursController {
  async handle(request: Request, response: Response) {
    const { companyId } = request.params;
    const { businessHours } =
      request.body as CreateBusinessHoursControllerRequestBody;

    const companiesRepository = new CompaniesRepository();
    const createBusinessHoursDayOfWeekService = new CreateBusinessHoursService(
      companiesRepository,
    );

    const businessHoursCreated =
      await createBusinessHoursDayOfWeekService.execute({
        companyId,
        businessHours,
      });

    response.json(businessHoursCreated);
  }
}
