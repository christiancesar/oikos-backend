import { AppError } from "@common/errors/AppError";
import { ICompaniesRepository } from "@modules/companies/repositories/ICompaniesRepository";
import IUsersRepository from "@modules/users/repositories/IUsersRepository";

export class ListCompanyByUserService {
  constructor(
    private usersRepository: IUsersRepository,
    private companiesRepository: ICompaniesRepository,
  ) {}

  public async execute(userId: string) {
    const userExist = await this.usersRepository.findByUserId(userId);
    if (!userExist) {
      throw new AppError("User not exists");
    }

    const companiesExist =
      await this.companiesRepository.findCompanyByUserId(userId);

    if (!companiesExist) {
      throw new AppError("User not have company");
    }

    const companies =
      await this.companiesRepository.listCompaniesByUserId(userId);

    return companies;
  }
}
