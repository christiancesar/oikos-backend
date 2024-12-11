import { AppError } from "@common/errors/AppError";
import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import { ICompaniesRepository } from "../../repositories/ICompaniesRepository";
import {
  CompanyEntity,
  CompanyType,
  IdentityType,
} from "@modules/companies/entities/Companies";

type UpdateCompanyServiceParams = {
  userId: string;
  company: {
    id: string;
    identity: string;
    identityType: IdentityType;
    companyType: CompanyType;
    acceptAppointments: boolean;
    stateRegistration?: string | null;
    status: boolean;
    isHeadquarters: boolean;
    businessName?: string | null;
    corporateName: string;
    email?: string | null;
    phones: string;
    startedActivityIn: Date;
  };
};

export class UpdateCompanyService {
  constructor(
    private usersRepository: IUsersRepository,
    private companiesRepository: ICompaniesRepository,
  ) {}

  async execute({
    userId,
    company,
  }: UpdateCompanyServiceParams): Promise<CompanyEntity> {
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

    // empresa precisa ter endereço, horário de funcionamento e itens de resíduos cadastrados para aceitar agendamentos
    if (
      !companyExist.address ||
      !companyExist.businessHours ||
      !companyExist.wasteItems
    ) {
      company.acceptAppointments = false;
    }

    const companyUpdated =
      await this.companiesRepository.updateCompany(company);

    return companyUpdated;
  }
}
