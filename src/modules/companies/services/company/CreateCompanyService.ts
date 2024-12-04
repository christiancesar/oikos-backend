import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import { ICompaniesRepository } from "../../repositories/ICompaniesRepository";
import { AppError } from "@common/errors/AppError";

type CreateCompanyServiceParams = {
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
export class CreateCompanyService {
  constructor(
    private usersRepository: IUsersRepository,
    private companiesRepository: ICompaniesRepository,
  ) {}

  public async execute({ userId, company }: CreateCompanyServiceParams) {
    const userExist = await this.usersRepository.findByUserId(userId);
    if (!userExist) {
      throw new AppError("User not exists");
    }

    const companiesExist =
      await this.companiesRepository.findCompanyByUserId(userId);

    if (companiesExist) {
      return companiesExist;
    }

    const startedActivityIn = new Date(company.startedActivityIn);
    company.startedActivityIn = startedActivityIn;

    const comprany = await this.companiesRepository.createCompany({
      userId,
      company,
    });

    return comprany;
  }
}
