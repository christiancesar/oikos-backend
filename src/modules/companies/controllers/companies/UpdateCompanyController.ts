import { Request, Response } from "express";
import { CompaniesRepository } from "@modules/companies/repositories/CompaniesRepository";
import { UpdateCompanyService } from "@modules/companies/services/company/UpdateCompanyService";
import { z } from "zod";
import {
  CompanyType,
  IdentityType,
} from "@modules/companies/entities/Companies";
import { UsersRepository } from "@modules/users/repositories/prisma/UsersRepository";

const updateCompanyRequestBodySchemaValidation = z.object({
  company: z.object({
    identity: z.string().min(11).max(14),
    identityType: z.nativeEnum(IdentityType),
    companyType: z.nativeEnum(CompanyType),
    stateRegistration: z.string().min(8).max(13).optional(),
    acceptAppointments: z.boolean().optional().default(false),
    status: z.boolean().default(true),
    isHeadquarters: z.boolean().default(true),
    businessName: z.string().min(3).optional(),
    corporateName: z.string().min(1),
    email: z.string().email().optional(),
    phones: z.string(),
    startedActivityIn: z.string().transform((value) => new Date(value)),
  }),
});

const requestParamsSchemaValidation = z.object({
  companyId: z.string().uuid(),
});

export class UpdateCompanyController {
  public async handle(request: Request, response: Response) {
    const { companyId } = requestParamsSchemaValidation.parse(request.params);
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
