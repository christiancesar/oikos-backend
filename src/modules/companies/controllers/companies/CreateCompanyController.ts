import {
  CompanyType,
  IdentityType,
} from "@modules/companies/entities/Companies";
import { CompaniesRepository } from "@modules/companies/repositories/CompaniesRepository";
import { CreateCompanyService } from "@modules/companies/services/company/CreateCompanyService";
import { UsersRepository } from "@modules/users/repositories/prisma/UsersRepository";
import { Request, Response } from "express";
import * as zod from "zod";

const CreateCompanyRequestBodySchemaValidation = zod.object({
  company: zod.object({
    identity: zod.string().min(11).max(14),
    identityType: zod.nativeEnum(IdentityType),
    companyType: zod.nativeEnum(CompanyType),
    acceptAppointments: zod.boolean().default(false).optional(),
    stateRegistration: zod.string().min(8).max(13).optional(),
    status: zod.boolean().default(true),
    isHeadquarters: zod.boolean().default(true),
    businessName: zod.string().min(3).optional(),
    corporateName: zod.string().min(1),
    email: zod.string().email().optional(),
    phones: zod.string(),
    startedActivityIn: zod.string().transform((value) => new Date(value)),
  }),
});

export class CreateCompanyController {
  public async handle(request: Request, response: Response): Promise<void> {
    const userId = request.user.id;
    const { company } = CreateCompanyRequestBodySchemaValidation.parse(
      request.body,
    );

    const usersRepository = new UsersRepository();
    const companiesRepository = new CompaniesRepository();
    const createCompanyService = new CreateCompanyService(
      usersRepository,
      companiesRepository,
    );

    const companyCreated = await createCompanyService.execute({
      userId,
      company,
    });

    response.json(companyCreated);
  }
}
