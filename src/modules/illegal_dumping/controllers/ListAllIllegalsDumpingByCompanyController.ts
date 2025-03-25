import { Request, Response } from "express";
import { StatusIllegalDumping } from "../entities/IllegalDumping";
import { IllegalDumpingRepository } from "../repositories/IllegalDumpingRepository";
import { ListAllIllegalsDumpingByCompanyService } from "../services/companies/ListAllIllegalsDumpingByCompanyService";
import { z } from "zod";
import { CompaniesRepository } from "@modules/companies/repositories/CompaniesRepository";

const serachIllegalDumpingQuerySchemaValidation = z.object({
  status: z.nativeEnum(StatusIllegalDumping).optional(),
});

const requestParamsSchemaValidation = z.object({
  companyId: z.string().uuid(),
});

export class ListAllIllegalsDumpingByCompanyController {
  async handle(request: Request, response: Response) {
    const { companyId } = requestParamsSchemaValidation.parse(request.params);
    const { status } = serachIllegalDumpingQuerySchemaValidation.parse(
      request.query,
    );
    const illegalRepository = new IllegalDumpingRepository();
    const companiesRepository = new CompaniesRepository();
    const service = new ListAllIllegalsDumpingByCompanyService(
      illegalRepository,
      companiesRepository,
    );
    const illegals = await service.execute({ status, companyId });

    response.json(illegals);
  }
}
