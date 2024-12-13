import { CompaniesRepository } from "@modules/companies/repositories/CompaniesRepository";
import { Request, Response } from "express";
import { IllegalDumpingRepository } from "../repositories/IllegalDumpingRepository";
import { UnassignIllegalDumpingService } from "../services/UnassignIllegalDumpingService";

export class UnassignIllegalDumpingController {
  async handle(req: Request, response: Response) {
    const { companyId, denunciationId } = req.params;

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
