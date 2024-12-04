import { CompaniesRepository } from "@modules/companies/repositories/CompaniesRepository";
import { CreateCompanyService } from "@modules/companies/services/company/CreateCompanyService";
import { UsersRepository } from "@modules/users/repositories/UsersRepository";
import { Request, Response } from "express";

type CreateCompanyRequestBody = {
  userId: string;
  company: {
    cnpj: string;
    stateRegistration: string;
    status: boolean;
    isHeadquarters: boolean;
    businessName: string;
    corporateName: string;
    email: string;
    phones: string;
    startedActivityIn: Date;
  };
};

export class CreateCompanyController {
  public async handle(request: Request, response: Response): Promise<void> {
    const userId = request.user.id;
    const { company } = request.body as CreateCompanyRequestBody;

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
