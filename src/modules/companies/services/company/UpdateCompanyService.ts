import { AppError } from "@common/errors/AppError";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
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
      throw new AppError("Company not found");
    }

    const startedActivityIn = new Date(company.startedActivityIn);
    company.startedActivityIn = startedActivityIn;

    // empresa precisa ter endereço, horário de funcionamento e itens de resíduos cadastrados para aceitar agendamentos
    if (company.acceptAppointments) {
      const businessHoursNotExists = !!(
        !companyExist.businessHours ||
        companyExist.businessHours.length === 0 ||
        null
      );

      const wasteItemsNotExists = !!(
        !companyExist.wasteItems ||
        companyExist.wasteItems.length === 0 ||
        null
      );

      const notEligible =
        !companyExist.address || businessHoursNotExists || wasteItemsNotExists;

      if (notEligible) {
        throw new AppError(
          "Company needs to have address, business hours and waste items registered to accept appointments",
        );
      }
    }

    const companyUpdated =
      await this.companiesRepository.updateCompany(company);

    return companyUpdated;
  }
}
