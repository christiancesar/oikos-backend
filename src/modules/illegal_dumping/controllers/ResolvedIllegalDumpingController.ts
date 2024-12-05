import { Request, Response } from "express";
import * as zod from "zod";
import { IllegalDumpingRepository } from "../repositories/IllegalDumpingRepository";
import { CompaniesRepository } from "@modules/companies/repositories/CompaniesRepository";
import { ResolvedIllegalDumpingService } from "../services/ResolvedIllegalDumpingService";

const ResolvedIllegalDumpingRequestBodySchemaValidation = zod.object({
  solverId: zod.string().uuid(),
  description: zod.string().min(10),
});

export class ResolvedIllegalDumpingController {
  async handle(request: Request, response: Response) {
    const { id } = request.params;
    const { solverId, description } =
      ResolvedIllegalDumpingRequestBodySchemaValidation.parse(request.body);

    const illegalDumpingRepository = new IllegalDumpingRepository();
    const companiesRepository = new CompaniesRepository();
    const service = new ResolvedIllegalDumpingService(
      illegalDumpingRepository,
      companiesRepository,
    );

    const illegal = await service.execute({ id, solverId, description });

    response.json(illegal);
  }
}
