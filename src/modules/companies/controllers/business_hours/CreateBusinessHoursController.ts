import { Request, Response } from "express";

import { CompaniesRepository } from "@modules/companies/repositories/CompaniesRepository";
import { CreateBusinessHoursService } from "@modules/companies/services/business_hours/CreateBusinessHoursService";
import { z } from "zod";
import { TimeSlot } from "@modules/companies/entities/BusinessHour";

type CreateBusinessHoursControllerRequestBody = {
  businessHours: {
    dayOfWeek: string;
    timeSlots: TimeSlot[];
  }[];
};

const requestParamsSchemaValidation = z.object({
  companyId: z.string().uuid(),
});

export class CreateBusinessHoursController {
  async handle(request: Request, response: Response) {
    const { companyId } = requestParamsSchemaValidation.parse(request.params);
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
