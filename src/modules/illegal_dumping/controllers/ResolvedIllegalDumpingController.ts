import { Request, Response } from "express";
import * as zod from "zod";
import { IllegalDumpingRepository } from "../repositories/IllegalDumpingRepository";
import { CompaniesRepository } from "@modules/companies/repositories/CompaniesRepository";
import { ResolvedIllegalDumpingService } from "../services/companies/ResolvedIllegalDumpingService";

const ResolvedIllegalDumpingRequestBodySchemaValidation = zod.object({
  description: zod.string().min(10),
});

export class ResolvedIllegalDumpingController {
  async handle(request: Request, response: Response) {
    const { companyId, denunciationId } = request.params;
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
