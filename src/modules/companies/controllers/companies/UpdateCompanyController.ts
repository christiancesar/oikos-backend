import { Request, Response } from "express";
import { UsersRepository } from "@modules/users/repositories/UsersRepository";
import { CompaniesRepository } from "@modules/companies/repositories/CompaniesRepository";
import { UpdateCompanyService } from "@modules/companies/services/company/UpdateCompanyService";

type UpdateCompanyRequestBody = {
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

export class UpdateCompanyController {
  public async handle(request: Request, response: Response) {
    const { companyId } = request.params;
    const userId = request.user.id;
    const { company } = request.body as UpdateCompanyRequestBody;

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
