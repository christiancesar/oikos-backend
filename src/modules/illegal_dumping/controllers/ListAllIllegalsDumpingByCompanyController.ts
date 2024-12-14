import { Request, Response } from "express";
import { StatusIllegalDumping } from "../entities/IllegalDumping";
import { IllegalDumpingRepository } from "../repositories/IllegalDumpingRepository";
import { ListAllIllegalsDumpingByCompanyService } from "../services/companies/ListAllIllegalsDumpingByCompanyService";
import * as zod from "zod";
import { CompaniesRepository } from "@modules/companies/repositories/CompaniesRepository";

const serachIllegalDumpingQuerySchemaValidation = zod.object({
  status: zod.nativeEnum(StatusIllegalDumping).optional(),
});

export class ListAllIllegalsDumpingByCompanyController {
  async handle(request: Request, response: Response) {
    const { companyId } = request.params;
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
