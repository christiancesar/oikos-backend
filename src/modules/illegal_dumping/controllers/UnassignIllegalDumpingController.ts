import { CompaniesRepository } from "@modules/companies/repositories/CompaniesRepository";
import { Request, Response } from "express";
import { IllegalDumpingRepository } from "../repositories/IllegalDumpingRepository";
import { UnassignIllegalDumpingService } from "../services/companies/UnassignIllegalDumpingService";
import { z } from "zod";
const requestParamsSchemaValidation = z.object({
  companyId: z.string().uuid(),
  denunciationId: z.string().uuid(),
});
export class UnassignIllegalDumpingController {
  async handle(req: Request, response: Response) {
    const { companyId, denunciationId } = requestParamsSchemaValidation.parse(
      req.params,
    );

    const companiesRepository = new CompaniesRepository();
    const illegalDumpingRepository = new IllegalDumpingRepository();
    const service = new UnassignIllegalDumpingService(
      illegalDumpingRepository,
      companiesRepository,
    );

    const illegal = await service.execute({
      denunciationId,
      solverId: companyId,
    });

    response.json(illegal);
  }
}
