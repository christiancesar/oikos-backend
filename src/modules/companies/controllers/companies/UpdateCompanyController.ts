import { Request, Response } from "express";
import { UsersRepository } from "@modules/users/repositories/UsersRepository";
import { CompaniesRepository } from "@modules/companies/repositories/CompaniesRepository";
import { UpdateCompanyService } from "@modules/companies/services/company/UpdateCompanyService";
import * as zod from "zod";
import {
  CompanyType,
  IdentityType,
} from "@modules/companies/entities/Companies";

const updateCompanyRequestBodySchemaValidation = zod.object({
  company: zod.object({
    identity: zod.string().min(11).max(14),
    identityType: zod.nativeEnum(IdentityType),
    companyType: zod.nativeEnum(CompanyType),
    stateRegistration: zod.string().min(8).max(13).optional(),
    acceptAppointments: zod.boolean().optional().default(false),
    status: zod.boolean().default(true),
    isHeadquarters: zod.boolean().default(true),
    businessName: zod.string().min(3).optional(),
    corporateName: zod.string().min(1),
    email: zod.string().email().optional(),
    phones: zod.string(),
    startedActivityIn: zod.string().transform((value) => new Date(value)),
  }),
});

export class UpdateCompanyController {
  public async handle(request: Request, response: Response) {
    const { companyId } = request.params;
    const userId = request.user.id;
    const { company } = updateCompanyRequestBodySchemaValidation.parse(
      request.body,
    );

    const usersRepository = new UsersRepository();
    const companiesRepository = new CompaniesRepository();

    const updateCompanyService = new UpdateCompanyService(
      usersRepository,
      companiesRepository,
    );

    const companyUpdated = await updateCompanyService.execute({
      userId,
      company: {
        id: companyId,
        ...company,
      },
    });

    response.json(companyUpdated);
  }
}
