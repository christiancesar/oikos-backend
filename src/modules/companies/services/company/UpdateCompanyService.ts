import { AppError } from "@common/errors/AppError";
import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import { ICompaniesRepository } from "../../repositories/ICompaniesRepository";

type UpdateCompanyServiceParams = {
  userId: string;
  company: {
    id: string;
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

export class UpdateCompanyService {
  constructor(
    private usersRepository: IUsersRepository,
    private companiesRepository: ICompaniesRepository,
  ) {}

  async execute({ userId, company }: UpdateCompanyServiceParams) {
    const userExist = await this.usersRepository.findByUserId(userId);

    if (!userExist) {
      throw new AppError("User not found");
    }

    const companyExist = await this.companiesRepository.findCompayById(
      company.id,
    );

    if (!companyExist) {
      throw new AppError("Profile not found");
    }

    const startedActivityIn = new Date(company.startedActivityIn);
    company.startedActivityIn = startedActivityIn;

    const companyUpdated =
      await this.companiesRepository.updateCompany(company);

    return companyUpdated;
  }
}
