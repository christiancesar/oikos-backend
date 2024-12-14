import { ICompaniesRepository } from "@modules/companies/repositories/ICompaniesRepository";
import { IllegalDumpingEntity } from "@modules/illegal_dumping/entities/IllegalDumping";
import { IIllegalDumpingRepository } from "@modules/illegal_dumping/repositories/IIllegalDumpingRepository";

export class ListAllIllegalsDumpingByCompanyService {
  constructor(
    private repository: IIllegalDumpingRepository,
    private companies: ICompaniesRepository,
  ) {}

  async execute({
    status,
    companyId,
  }: {
    status?: string;
    companyId: string;
  }): Promise<IllegalDumpingEntity[]> {
    const company = await this.companies.findCompayById(companyId);

    if (!company) {
      throw new Error("Company not found");
    }

    const statusSearch = status?.trim() === "" ? undefined : status;
    return this.repository.listAllIllegalsDumpingByCompanyId({
      status: statusSearch,
      solverId: companyId,
    });
  }
}
