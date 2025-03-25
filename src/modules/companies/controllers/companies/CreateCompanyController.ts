import {
  CompanyType,
  IdentityType,
} from "@modules/companies/entities/Companies";
import { CompaniesRepository } from "@modules/companies/repositories/CompaniesRepository";
import { CreateCompanyService } from "@modules/companies/services/company/CreateCompanyService";
import { UsersRepository } from "@modules/users/repositories/prisma/UsersRepository";
import { Request, Response } from "express";
import { z } from "zod";

const CreateCompanyRequestBodySchemaValidation = z.object({
  company: z.object({
    identity: z.string().min(11).max(14),
    identityType: z.nativeEnum(IdentityType),
    companyType: z.nativeEnum(CompanyType),
    acceptAppointments: z.boolean().optional().default(false),
    stateRegistration: z.string().min(8).max(13).optional(),
    status: z.boolean().default(true),
    isHeadquarters: z.boolean().default(true),
    businessName: z.string().min(3).optional(),
    corporateName: z.string().min(1),
    email: z.string().email().optional(),
    phones: z.string(),
    startedActivityIn: z.string().transform((value) => new Date(value)),
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
