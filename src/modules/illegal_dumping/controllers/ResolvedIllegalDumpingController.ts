import { Request, Response } from "express";
import { z } from "zod";
import { IllegalDumpingRepository } from "../repositories/IllegalDumpingRepository";
import { CompaniesRepository } from "@modules/companies/repositories/CompaniesRepository";
import { ResolvedIllegalDumpingService } from "../services/companies/ResolvedIllegalDumpingService";

const ResolvedIllegalDumpingRequestBodySchemaValidation = z.object({
  description: z.string().min(10),
});

const requestParamsSchemaValidation = z.object({
  companyId: z.string().uuid(),
  denunciationId: z.string().uuid(),
});

export class ResolvedIllegalDumpingController {
  async handle(request: Request, response: Response) {
    const { companyId, denunciationId } = requestParamsSchemaValidation.parse(
      request.params,
    );
    const { description } =
      ResolvedIllegalDumpingRequestBodySchemaValidation.parse(request.body);

    const illegalDumpingRepository = new IllegalDumpingRepository();
    const companiesRepository = new CompaniesRepository();
    const service = new ResolvedIllegalDumpingService(
      illegalDumpingRepository,
      companiesRepository,
    );

    const illegal = await service.execute({
      id: denunciationId,
      solverId: companyId,
      description,
    });

    response.json(illegal);
  }
}
