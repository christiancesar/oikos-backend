import { CompaniesRepository } from "@modules/companies/repositories/CompaniesRepository";
import { ListCompanyByUserService } from "@modules/companies/services/company/ListCompanyByUserService";
import { UsersRepository } from "@modules/users/repositories/UsersRepository";
import { Request, Response } from "express";

export class ListCompanyByUserController {
  async handle(request: Request, response: Response) {
    const userId = request.user.id;

    const companiesRepository = new CompaniesRepository();
    const usersRepository = new UsersRepository();
    const listCompanyByUserService = new ListCompanyByUserService(
      usersRepository,
      companiesRepository,
    );

    const companies = await listCompanyByUserService.execute(userId);

    response.json(companies);
  }
}
